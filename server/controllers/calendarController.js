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

    calendar.events.list({
      auth: authClient,
      calendarId: 'primary',
      timeMin: now.toISOString(),
      timeMax: new Date(now.setYear(2017)).toISOString(),
      singleEvents: true,
      orderBy: 'startTime'
    }, (err, response) => {
      if (err) {
        console.log('The API returned an error: ' + err);
        return res.send(404);
      }
      if (response.items.length == 0) {
        res.send('No upcoming events found.');
      } else {
        // this will need to be fixed
        // i currently dunno the behavior of the start and end properties
        let events = response.items.filter(event => {
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
    authClient.setCredentials(req.session['tokens']);
    calendar.events.insert({
      auth: authClient,
      calendarId: 'primary',
      resource: req.body
    }, (err, event) => {
      if (err) {
        console.log('There was an error contacting the Calendar service: ' + err);
        return res.send(404);
      }
      res.status(201).send('event created!');
    });
  }
}
