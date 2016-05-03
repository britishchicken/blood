'use strict'
let fs = require('fs');
let readline = require('readline');
let google = require('googleapis');
let googleAuth = require('google-auth-library');
let calendar = google.calendar('v3');


// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/calendar-nodejs-quickstart.json
const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) + '/.credentials/';
const TOKEN_PATH = TOKEN_DIR + '/calendar-nodejs-quickstart.json';

let authorize = (credentials, callback) => {
  let clientSecret = credentials.installed.client_secret;
  let clientId = credentials.installed.client_id;
  let redirectUrl = credentials.installed.redirect_uris[0];
  let auth = new googleAuth();
  let oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) {
      getNewToken(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client);
    }
  });
};

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
let getNewToken = (oauth2Client, callback) => {
  let authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oauth2Client.getToken(code, (err, token) => {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
  });
};

let storeToken = (token) => {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
};

module.exports = {
  showEvents: (req, res) => {
    fs.readFile(__dirname + '/client_secret.json', (err, content) => {
      if (err) {
        console.log('Error loading client secret file: ' + err);
        return res.send(404);
      }
      authorize(JSON.parse(content), (auth) => {
        // console.log(auth);
        calendar.events.list({
          auth: auth,
          calendarId: 'primary',
          timeMin: (new Date()).toISOString(),
          maxResults: 10,
          singleEvents: true,
          orderBy: 'startTime'
        }, (err, response) => {
          if (err) {
            return console.error('The API returned an error: ' + err);
          }
          // let events = response.items;
          // if (events.length == 0) {
          //   return res.send('No upcoming events found.');
          // } else {
          //   let retArray = [];
          //   for (var i = 0; i < events.length; i++) {
          //     let event = events[i];
          //     let start = event.start.dateTime || event.start.date;
          //     console.log('%s - %s', start, event.summary);
          //     retArray.push(start + ' - ' + event.summary);
          //   }
          let retArray = [];
          response.items.forEach((item) => {
            let obj = {};
            obj.title = item.summary;
            obj.kind = item.kind;
            obj.etag = item.etag;
            obj.id = item.id;
            obj.status = item.status;
            obj.url = item.htmlLink;
            obj.start = item.start.dateTime;
            obj.end = item.end.dateTime;
            retArray.push(obj);
          });
          return res.send(retArray);
          // }
        });
      });
    });
  },

  addEvent: (req, res) => {
    fs.readFile(__dirname + '/client_secret.json', (err, content) => {
      if (err) {
        console.log('Error loading client secret file: ' + err);
        return res.send(404);
      }
      authorize(JSON.parse(content), (auth) => {
        calendar.events.insert({
          auth: auth,
          calendarId: 'primary',
          resource: req.body
        }, (err, event) => {
          if (err) {
            console.log('There was an error contacting the Calendar service: ' + err);
            return res.send(404);
          }
          return res.status(201).send('event created!');
        });
      });
    });
  }
}
