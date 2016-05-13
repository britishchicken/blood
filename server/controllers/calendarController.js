'use strict'
let google = require('googleapis');
let calendar = google.calendar('v3');
let getAuthClient = require('../routes/auth.js').getAuthClient;

let showGoogleEvents = (req, res) => {
  let authClient = getAuthClient();

  authClient.setCredentials(req.session['tokens']);
  let now = new Date();
  let later = new Date();
  later.setMonth(later.getMonth() + 1);

  calendar.events.list({
    auth: authClient,
    calendarId: 'primary',
    timeMin: now.toISOString(),
    timeMax: later.toISOString(),
    singleEvents: true,
    orderBy: 'startTime'
  }, (err, response) => {
    if (err) {
      console.log('There was an error on the server side: ' + err);
      return res.send(500);
    }
    if (response.items.length == 0) {
      console.log('No upcoming events found in the 1 month.');
      res.send(200);
    } else {
      // this will need to be fixed
      // i currently dunno the behavior of the start and end properties
      let events = response.items.filter(event => {
        // perhaps this is never true
        if (!event.end) {
          console.log('!!!!!no end date: ', event);
        }
        return event.end;
      });

      res.send(events.map(item => {
        return {
          title: item.summary,
          kind: item.kind,
          etag: item.etag,
          id: item.id,
          status: item.status,
          url: item.htmlLink,
          start: item.start.dateTime || item.start.date,
          end: item.end.dateTime || item.end.date
        }
      }));
    }
  });
};

let showHospitalEvents = (req, res) => {
  Event.findAll()
}

module.exports = {
  showEvents: (req, res) => {
    // console.log(req.session);
    if (!req.session.tokens) {
      console.log('gmail is not enabled!');
      return res.send(401);
    }

    console.log('user is a donor and gmail token is enabled!');
    showGoogleEvents(req, res);

  },

  addEvent: (req, res) => {
    let authClient = getAuthClient();
    if (!req.session.tokens) {
      console.log('no tokens present!');
      return res.send(401);
    }

    authClient.setCredentials(req.session['tokens']);
    calendar.events.insert({
      auth: authClient,
      calendarId: 'primary',
      resource: req.body
    }, (err, event) => {
      if (err) {
        console.log('There was an error contacting the Calendar service: ' + err);
        return res.send(500);
      }
      res.status(201).send('event created!');
    });
  }
}
