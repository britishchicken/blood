'use strict'
let google = require('googleapis');
let calendar = google.calendar('v3');
let getAuthClient = require('../routes/auth.js').getAuthClient;

module.exports = {
  showEvents: (req, res) => {
    let authClient = getAuthClient();
    if (!req.session['tokens']) {
      console.log('no tokens present!');
      return res.send(401);
    }
    authClient.setCredentials(req.session['tokens']);
    let now = new Date();
    let later = new Date();
    later.setMonth(later.getMonth() + 3);

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
        console.log('No upcoming events found in the 3 months.');
        res.send(200);
      } else {
        // this will need to be fixed
        // i currently dunno the behavior of the start and end properties
        let events = response.items.filter(event => {
          if (!event.start.dateTime || !event.end.dateTime) {
            console.log('!!!!!bug in code: ', event);
          }
          return event.start.dateTime && event.end.dateTime;
        });

        res.send(events.map(item => {
          return {
            title: item.summary,
            kind: item.kind,
            etag: item.etag,
            id: item.id,
            status: item.status,
            url: item.htmlLink,
            start: item.start.dateTime,
            end: item.end.dateTime
          }
        }));
      }
    });

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
