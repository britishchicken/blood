(() => {
  app.controller('CalendarController', ['$http', '$window', '$routeParams', '$scope', function($http, $window, $routeParams, $scope) {
    let CalendarCtrl = this;
    let $calendar = $('#calendar');

    CalendarCtrl.possibleEvents = [];
    CalendarCtrl.googleEvents = [];
    CalendarCtrl.time = {};
    // CalendarCtrl.isLoggedin = false;

    CalendarCtrl.populateDates = () => {
      $calendar.fullCalendar('removeEventSource');
      CalendarCtrl.possibleEvents = [];

      // let googleEvents = $calendar.fullCalendar('clientEvents');
      // console.log(googleEvents);
      $http.get(`/api/hospital/profile/${$routeParams.hospitalid}`).then(res => {
        $http.get('/api/calendar').then(() => {
          console.log('populating google calendar dates for logged in user');
          CalendarCtrl.populateHospitalDates(res.data);
        })
        .then(() => {
          console.log('populating possible hospital dates');
          CalendarCtrl.getGoogleData();
        })
        .catch(err => {
          console.log('populating hospital dates for not logged in user');
          CalendarCtrl.populateHospitalDates(res.data);
        });
      })
      .catch(err => {
        console.log('noo: ', err);
      });
    };

    CalendarCtrl.populateHospitalDates = (hospitalEvents) => {

      let current = new Date();
      let day, dayIndex, startHour, endHour;
      let id = 1;

      for (let counter = 0; counter < 31; counter++) {
        current = new Date(current.getTime() + (1000 * 60 * 60 * 24));
        day = current.getDay();
        dayIndex = ( (day + 7) - 1 ) % 7;

        // if they are opened on that day, populate that day
        if (hospitalEvents.schedules[dayIndex].openhours) {
          startHour = hospitalEvents.schedules[dayIndex].openhours;
          endHour = hospitalEvents.schedules[dayIndex].closehours;

          for (let currentHour = startHour; currentHour < endHour; currentHour++) {
            let endHour, endMinutes;
            CalendarCtrl.possibleEvents.push({
              id: id,
              title: 'Slot Available',
              start: current.setHours(currentHour,0,0,0),
              // end: current.setHours(currentHour,45,0,0),
            });
            id++;
          }
        }
      }
      $calendar.fullCalendar('addEventSource', {
        events: CalendarCtrl.possibleEvents,
        backgroundColor: '#378006'
      });
      // console.log($calendar.fullCalendar('clientEvents'));
    }

    CalendarCtrl.googleSignin = () => {
      // if (CalendarCtrl.isLoggedin) {
        // return console.log('you are already logged in!');
      // }

      $http.get('/auth/url').then(res => {
        let url = res.data;
        let newWindow = $window.open(url, 'AuthPage', 'width=500px,height=700px');

        // grabs message with code from oauthcallback.html and stores it in `e`
        $window.onmessage = (e) => {
          let urlWithCode = e.data;
          let index = urlWithCode.lastIndexOf('code=');
          let code = urlWithCode.substring(index + 5).replace('#', '');
          newWindow.close();

          $http.get('/auth/googleToken?code=' + code).then(res => {
            console.log('You are authenticated!');
            CalendarCtrl.getGoogleData();
            // CalendarCtrl.isLoggedin = true;
            // $window.localStorage.setItem('signedin', true);
          });
        };
      });
    }

    CalendarCtrl.getGoogleData = () => {
      $http.get('/api/calendar').then(res => {
        $calendar.fullCalendar('addEventSource', res.data);

        res.data.forEach(event => {
          // CalendarCtrl.googleEvents.push(event);
          CalendarCtrl.checkOverlap(event);
        });
      });
    }

    CalendarCtrl.checkOverlap = (googleEvent) => {
      let isOverlap = false;
      let index = 0;
      while (!isOverlap && (index < CalendarCtrl.possibleEvents.length)) {
        let appointmentDate = new Date(CalendarCtrl.possibleEvents[index].start);
        let start = new Date(googleEvent.start);
        let end = new Date(googleEvent.end);

        isOverlap = appointmentDate.getFullYear() === start.getFullYear() &&
          appointmentDate.getMonth() === start.getMonth() &&
          appointmentDate.getDate() === start.getDate() &&
          appointmentDate.getHours() >= start.getHours() + (start.getMinutes() / 60) &&
          appointmentDate.getHours() <= end.getHours() + (end.getMinutes() / 60);

        index++;
      }

      if (isOverlap) {
        // console.log(CalendarCtrl.possibleEvents[index]);
        $calendar.fullCalendar('removeEvents', CalendarCtrl.possibleEvents[index -1].id);
        // CalendarCtrl.possibleEvents.splice(index - 1, 1);
      }
    };

    CalendarCtrl.setView = (calEvent) => {
      // console.log('1.', CalendarCtrl.eventTime);
      let month = calEvent.start.month();
      let day = calEvent.start.day();
      let hour = calEvent.start.hour();
      let minute = calEvent.start.minutes();
      minute = minute < 10 ? minute + '0' : minute;

      CalendarCtrl.time.start = calEvent.start;
      CalendarCtrl.time.end = calEvent.end;

      CalendarCtrl.time.print = `${month}/${day} @ ${hour}:${minute}`;
    };

    $calendar.fullCalendar({
      timezone: 'local',
      displayEventEnd: true,
      // eventSources: ['/api/calendar'],
      eventClick: (calEvent, jsEvent, view) => {
        // console.log(calEvent);
        if (calEvent.title === 'Slot Available') {
          let modal = $('.modal');
          // console.log(calEvent.start);
          modal.find(".modal-title").html(event.title);
          CalendarCtrl.setView(calEvent);
          $scope.$apply();
          modal.modal();
        }
      }
    });

    CalendarCtrl.makeEvent = () => {
      CalendarCtrl.createEvent(CalendarCtrl.time.start, CalendarCtrl.time.end);
    };

    CalendarCtrl.createEvent = (startDate, endDate) => {
      startDate = startDate || CalendarCtrl.dateTime;
      endDate = endDate || CalendarCtrl.dateTime || startDate;

      $http({
        method: 'POST',
        url: '/api/calendar/',
        data: {
          summary: 'Blood',
          location: '800 Howard St., San Francisco, CA 94103',
          description: 'A chance to hear more about Google\'s developer products.',
          start: {
            dateTime: startDate,
            timeZone: 'America/Los_Angeles',
          },
          end: {
            dateTime: endDate,
            timeZone: 'America/Los_Angeles'
          }
        }
      })
      .then(res => {
        if (res.status === 201) {
          // $calendar.fullCalendar('refetchEvents');
          $calendar.fullCalendar('removeEvents');
          CalendarCtrl.populateDates();
          // $calendar.fullCalendar('removeEventSource', CalendarCtrl.possibleEvents);
          // CalendarCtrl.possibleEvents = [];
          // CalendarCtrl.automateDates();
        }
      });
    };

    CalendarCtrl.googleLogin = () => {
      $http.get('/auth/url').then(res => {
        let url = res.data;
        let newWindow = $window.open(url, 'AuthPage', 'width=500px,height=700px');

        // grabs message with code from oauthcallback.html and stores it in `e`
        $window.onmessage = (e) => {
          let urlWithCode = e.data;
          let index = urlWithCode.lastIndexOf('code=');
          let code = urlWithCode.substring(index + 5).replace('#', '');
          newWindow.close();

          $http.get('/auth/googleToken?code=' + code).then(res => {
            console.log('You are authenticated!');
            // $calendar.fullCalendar('removeEventSource', CalendarCtrl.possibleEvents);
            $calendar.fullCalendar('refetchEvents');
            // CalendarCtrl.googleEvents = $calendar.fullCalendar('clientEvents');
            // setTimeout(CalendarCtrl.automateDates, 0);
          });
        };
      });
    };

    CalendarCtrl.populateDates();


    // CalendarCtrl.reload = () => {
    //   $calendar.fullCalendar('refetchEvents');
    // };

//     CalendarCtrl.automateDates = () => {
//       $calendar.fullCalendar('removeEventSource', CalendarCtrl.possibleEvents);
//       let googleEvents = $calendar.fullCalendar('clientEvents');
//       console.log(googleEvents);

//       $http.get(`api/hospital/profile/${$routeParams.hospitalid}`).then(res => {

//         let current = new Date()
//         let day, dayIndex, startHour, endHour;

//         $calendar.fullCalendar('removeEventSource', CalendarCtrl.possibleEvents);
//         CalendarCtrl.possibleEvents = [];

//         console.log('automating');
//         for (let counter = 0; counter < 28; counter++) {
//           current = new Date(current.getTime() + (1000 * 60 * 60 * 24));
//           day = current.getDay();
//           dayIndex = ( (day + 7) - 1 ) % 7;

//           if (res.data.schedules[dayIndex].openhours) {
//             let isOverlap;
//             startHour = res.data.schedules[dayIndex].openhours;
//             endHour = res.data.schedules[dayIndex].closehours;

//             for (let currentHour = startHour; currentHour < endHour; currentHour++) {
//               isOverlap = false;
//               let endHour, endMinutes;
//               for (let googleEvent of googleEvents) {
//                 // console.log(googleEvent);
//                 googleEvent._end ? endHour = googleEvent._end.hour() : googleEvent._start.hour();
//                 googleEvent._end ? endMinutes = googleEvent._end.minutes() : googleEvent._start.minutes();

//                 if ((current.getDate() === googleEvent._start.date()) && (current.getMonth() === googleEvent._start.month()) &&
//                   ((currentHour >= googleEvent._start.hour() + googleEvent._start.minutes() / 60) || (currentHour+0.75 >= googleEvent._start.hour() + googleEvent._start.minutes() / 60)) &&
//                   ((currentHour <= endHour + endMinutes / 60) || (currentHour+0.75 <= endHour + endMinutes / 60))) {
//                   isOverlap = true;
//                   break;

//                 }
//               }
//               if (!isOverlap) {
//                 CalendarCtrl.possibleEvents.push({
//                   title: 'Schedule an appointment!',
//                   start: current.setHours(currentHour,0,0,0),
//                   end: current.setHours(currentHour,45,0,0),
//                   // eventOverlap: false
//                 });
//               }

//             }
//           }
//         }

//         $calendar.fullCalendar('addEventSource', {
//           events: CalendarCtrl.possibleEvents,
//           // eventOverlap: false,
//           backgroundColor: '#378006'
//         });
//       });
//     }
  }]);
})();
