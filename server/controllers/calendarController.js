'use strict'
let google = require('googleapis');
let googleAuth = require('google-auth-library');
let auth = new googleAuth();
let calendar = google.calendar('v3');

module.exports = {
  showEvents: (req, res) => {
    let now = new Date();

    calendar.events.list({
      auth: google._options.auth,
      calendarId: 'primary',
      timeMin: now.toISOString(),
      timeMax: new Date(now.setYear(2017)).toISOString(),
      singleEvents: true,
      orderBy: 'startTime'
    }, (err, response) => {
      if (err) {
        console.error('The API returned an error: ' + err);
        return res.send(404);
      }
      let events = response.items;
      if (events.length == 0) {
        res.send('No upcoming events found.');
      } else {
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
    console.log('hiiii');
    calendar.events.insert({
      auth: google._options.auth,
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
