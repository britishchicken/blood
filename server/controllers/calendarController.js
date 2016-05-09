'use strict'
let google = require('googleapis');
// let googleAuth = require('google-auth-library');
// let auth = new googleAuth();
let calendar = google.calendar('v3');
let getAuthClient = require('../routes/auth.js').getAuthClient;

module.exports = {
  showEvents: (req, res) => {
    let authClient = getAuthClient();
    if (!req.session['tokens']) {
      return res.send(401);
    }

    // console.log('<<<', res);
    // console.log('hiii\n\n\n');
    // console.log('\n\n\nNOW\n\n\n');
    // console.log(auth.client);
    console.log('11111');
    authClient.setCredentials(req.session['tokens']);
    // if (!auth.client) {
    //   console.log('no auth!');
    //   return res.send(401);
    // }

    let now = new Date();

    calendar.events.list({
      auth: authClient,
      calendarId: 'primary',
      timeMin: now.toISOString(),
      timeMax: new Date(now.setYear(2017)).toISOString(),
      singleEvents: true,
      orderBy: 'startTime'
    }, (err, response) => {
      console.log('22222');

      if (err) {
        console.error('The API returned an error: ' + err);
        return res.send(404);
      }
      console.log('33333');

      let events = response.items;
      console.log(events);
      if (events.length == 0) {
        res.send('No upcoming events found.');
      } else {
        console.log('44444');
        events = events.filter(event => {
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
