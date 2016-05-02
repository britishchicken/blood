(() => {
  app.controller('CalendarController', ['$http', function($http) {
    let CalendarCtrl = this;
    let CLIENT_ID = '201136918452-keglqvefmnl0gf5thj0lsp4o720v5f7v.apps.googleusercontent.com';
    const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];

    // maybe not necessary for onload
    // CalendarCtrl.checkAuth = () => {
    //   gapi.auth.authorize(
    //     {
    //       'client_id': CLIENT_ID,
    //       'scope': SCOPES.join(' '),
    //       'immediate': true
    //     }, CalendarCtrl.handleAuthResult);
    // };

    CalendarCtrl.handleAuthClick = (event) => {
      gapi.auth.authorize({
        client_id: CLIENT_ID, 
        scope: SCOPES, 
        immediate: false
      }, CalendarCtrl.handleAuthResult);
    };

    CalendarCtrl.handleAuthResult = (authResult) => {
      let authorizeDiv = document.getElementById('authorize-div');
      if (authResult && !authResult.error) {
        CalendarCtrl.loadCalendarApi();
      } else {
        // not sure yet
        console.log('something not working!');
      }
    };

    CalendarCtrl.loadCalendarApi = () => {
      gapi.client.load('calendar', 'v3', CalendarCtrl.listUpcomingEvents);
    };

    CalendarCtrl.listUpcomingEvents = () => {
      let request = gapi.client.calendar.events.list({
        'calendarId': 'primary',
        'timeMin': (new Date()).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 15,
        'orderBy': 'startTime'
      });

      request.execute(function(resp) {
        var events = resp.items;
        appendPre('The up comming events in your calendar are:'+ '\n'+'\n');



        if (events.length > 0) {
          for (i = 0; i < events.length; i++) {

            var event = events[i];
            var when = event.start.dateTime;

            if (!when) {
              when = event.start.date;
            }
            appendPre(i+1+' '+ event.summary + ' ('+' '+ when +' '+ ')' + '\n');
          }
        } else {
          appendPre('No upcoming events found.');
        }

      });

      function appendPre(message) {
        var pre = document.getElementById('output');
        var textContent = document.createTextNode(message + '\n');
        pre.appendChild(textContent);
      }

    }
  }]);
})();
