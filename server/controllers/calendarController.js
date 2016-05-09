'use strict'
let google = require('googleapis');
let googleAuth = require('google-auth-library');
// let auth = new googleAuth();
let calendar = google.calendar('v3');
let auth = require('../routes/auth.js');

module.exports = {
  showEvents: (req, res) => {
    if (!req.session['tokens']) {
      return res.send(401);
    }

    // console.log('<<<', res);
    // console.log('hiii\n\n\n');
    // console.log('\n\n\nNOW\n\n\n');
    // console.log(auth.client);
    console.log('hiiii', req.session['tokens']);
    auth.client.setCredentials(req.session['tokens']);
    // if (!auth.client) {
    //   console.log('no auth!');
    //   return res.send(401);
    // }

    let now = new Date();

    calendar.events.list({
      auth: auth.client,
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
    calendar.events.insert({
      auth: auth.client,
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
