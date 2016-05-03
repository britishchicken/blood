(() => {
  app.controller('CalendarController', ['$http', '$window', function($http, $window) {
    // let CalendarCtrl = this;
    // let CLIENT_ID = '201136918452-keglqvefmnl0gf5thj0lsp4o720v5f7v.apps.googleusercontent.com';
    // const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];

    // // maybe not necessary for onload
    // // CalendarCtrl.checkAuth = () => {
    // //   gapi.auth.authorize(
    // //     {
    // //       'client_id': CLIENT_ID,
    // //       'scope': SCOPES.join(' '),
    // //       'immediate': true
    // //     }, CalendarCtrl.handleAuthResult);
    // // };

    // CalendarCtrl.handleAuthClick = (event) => {
    //   gapi.auth.authorize({
    //     client_id: CLIENT_ID, 
    //     scope: SCOPES, 
    //     immediate: false
    //   }, CalendarCtrl.handleAuthResult);
    // };

    // CalendarCtrl.handleAuthResult = (authResult) => {
    //   let authorizeDiv = document.getElementById('authorize-div');
    //   if (authResult && !authResult.error) {
    //     CalendarCtrl.loadCalendarApi();
    //   } else {
    //     // not sure yet
    //     console.log('something not working!');
    //   }
    // };

    // CalendarCtrl.loadCalendarApi = () => {
    //   gapi.client.load('calendar', 'v3', CalendarCtrl.listUpcomingEvents);
    // };

    // CalendarCtrl.listUpcomingEvents = () => {
    //   let request = gapi.client.calendar.events.list({
    //     'calendarId': 'primary',
    //     'timeMin': (new Date()).toISOString(),
    //     'showDeleted': false,
    //     'singleEvents': true,
    //     'maxResults': 15,
    //     'orderBy': 'startTime'
    //   });

    //   request.execute(function(resp) {
    //     var events = resp.items;
    //     appendPre('The up comming events in your calendar are:'+ '\n'+'\n');



    //     if (events.length > 0) {
    //       for (i = 0; i < events.length; i++) {

    //         var event = events[i];
    //         var when = event.start.dateTime;

    //         if (!when) {
    //           when = event.start.date;
    //         }
    //         appendPre(i+1+' '+ event.summary + ' ('+' '+ when +' '+ ')' + '\n');
    //       }
    //     } else {
    //       appendPre('No upcoming events found.');
    //     }

    //   });

    //   function appendPre(message) {
    //     var pre = document.getElementById('output');
    //     var textContent = document.createTextNode(message + '\n');
    //     pre.appendChild(textContent);
    //   }

    // }

    let CalendarCtrl = this;

    CalendarCtrl.reloadRoute = () => {
      console.log('hi');
      $window.location.reload();
    };

    CalendarCtrl.showAllEvents = () => {
      $http({
        method: 'GET',
        url: '/api/calendar/'
      })
      .then(res => {
        // console.log(res);
        CalendarCtrl.events = res.data;
        // console.log(CalendarCtrl.events);
      });
    };

    CalendarCtrl.createEvent = () => {
      $http({
        method: 'POST',
        url: '/api/calendar/',
        data: {
          summary: 'Blood',
          location: '800 Howard St., San Francisco, CA 94103',
          description: 'A chance to hear more about Google\'s developer products.',
          start: {
            dateTime: CalendarCtrl.dateTime,
            timeZone: 'America/Los_Angeles',
          },
          'end': {
            'dateTime': CalendarCtrl.dateTime,
            'timeZone': 'America/Los_Angeles',
          },
          // recurrence: [
          //   RRULE:FREQ=DAILY;COUNT=2
          // ],
          // 'attendees': [
          //   {'email': 'lpage@example.com'},
          //   {'email': 'sbrin@example.com'},
          // ],
          // 'reminders': {
          //   'useDefault': false,
          //   'overrides': [
          //     {'method': 'email', 'minutes': 24 * 60},
          //     {'method': 'popup', 'minutes': 10},
          //   ],
          // },
        }
      })
      .then((res) => {
        if (res.status === 201) {
          console.log('hi');
          $window.location.assign('/#calendar');
        }
      });
    };


    // CalendarCtrl.showAllEvents();
  }]);
})();
