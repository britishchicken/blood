(() => {
  app.controller('CalendarController', ['$scope','$rootScope', '$controller', '$http', '$window', '$routeParams', 'Calendar', 'Event', 'Feed', 'Buddy', 'HospitalProfile', 'Appointment', function($scope, $rootScope, $controller, $http, $window, $routeParams, Calendar, Event,Feed,Buddy, HospitalProfile, Appointment) {
    let CalendarCtrl = this;
    let hospitalId = $routeParams.hospitalid;
    let $calendar = $('#calendar');
    let $datetimepicker = $('#datetimepicker').datetimepicker();

    CalendarCtrl.buddy= false;
    CalendarCtrl.view = {
      time: {}
    };
    CalendarCtrl.isHospital = !!($window.localStorage.getItem('isHospital'));

    let donorView = (callback) => {
      $window.localStorage.setItem('isHospital', '');
      CalendarCtrl.isHospital = $window.localStorage.getItem('isHospital');
      Calendar.getGoogleSchedule().then(googleEvents => {
        fillDonorCalendar(googleEvents, callback);
      }).catch(err => {
        fillDonorCalendar([], callback);
      });
    };

    let fillDonorCalendar = (googleEvents, callback) => {
      $calendar.fullCalendar('removeEvents');
      $calendar.fullCalendar('addEventSource', googleEvents);
      getAppointmentData(googleEvents, callback);
    };

    let getAppointmentData = (googleEvents, callback) => {
      HospitalProfile.get(hospitalId).then(data => {
        if (!data) {
          callback(null);
          return console.error('invalid hospital id!');
        }
        let currentDate = new Date();
        if (!CalendarCtrl.eventsChecked) {
          let appointments = _.flatten(_.range(31).map(counter => {
            currentDate = new Date(currentDate.getTime() + (1000 * 60 * 60 * 24));
            let dayIndex = (currentDate.getDay() + 6) % 7;
            return {
              currentDate: currentDate,
              openhour: data.schedules[dayIndex].openhours,
              endhour: data.schedules[dayIndex].closehours,
            };
          }).filter(data => {
            return !!data.openhour;
          }).map(data => {
            return _.range(data.openhour, data.endhour).map(hour => {
              return {
                title: 'Slot Available',
                start: data.currentDate.setHours(hour, 0, 0, 0),
                backgroundColor: '#378006'
              };
            });
          }));
          checkOverlap(appointments, googleEvents);
          callback(appointments);
        } else {
          callback([]);
        }
      });
    };

    let checkOverlap = (appointments, googleEvents) => {
      for (let googleEvent of googleEvents) {
        let isOverlap = false;
        let startIndex = 0;
        let endIndex = appointments.length -1;
        let midIndex, appointmentTime, startTime, endTime;

        while (!isOverlap && (startIndex <= endIndex)) {
          midIndex = Math.floor((startIndex + endIndex) / 2);
          startTime = new Date(googleEvent.start).getTime();
          endTime = new Date(googleEvent.end).getTime();
          appointmentTime = appointments[midIndex].start;

          if((appointmentTime >= startTime) && (appointmentTime <= endTime)) {
            isOverlap = true;
          } else if (appointmentTime < startTime) {
            startIndex = midIndex + 1;
          } else {
            endIndex = midIndex - 1;
          }
        }

        if (isOverlap) {
          removeEventData(appointments, midIndex);
        }
      }
    };

    let removeEventData = (appointments, index) => {
      appointments.splice(index, 1);
    };

    let hospitalView = (callback) => {
      Appointment.getAll().then(appointments => {
        Event.getAll().then(events => {
          $window.localStorage.setItem('isHospital', 'hello world');
          CalendarCtrl.isHospital = $window.localStorage.getItem('isHospital');
          fillHospitalCalendar(appointments, events, callback);
        })
      }).catch(err => {
        console.error('you are not logged in as a hospital user', err);
        $window.localStorage.setItem('isHospital', '');
        CalendarCtrl.isHospital = $window.localStorage.getItem('isHospital');
      })
    };

    let fillHospitalCalendar = (appointments, events, callback) => {
      appointments = appointments.filter(data => {
        return data.time;
      }).map(data => {
        return {
          title: `Appointment with ${data.donor.name}`,
          start: new Date(data.time),
          data: data
        };
      });
      events = events.filter(data => {
        return data.time;
      }).map(data => {
        return {
          title: `Event`,
          start: new Date(data.time),
          data: data,
          backgroundColor: 'red'
        }
      });
      callback(appointments.concat(events));
    };

    let pushToGoogle = (data) => {
      Calendar.postToGoogle(data).then(res => {
        $calendar.fullCalendar('removeEvents');
        $calendar.fullCalendar('addEventSource', [{
          title: data.summary,
          start: data.start.dateTime
        }]);
      }).catch(err => {
        console.error('unable to sync to google', err);
        $calendar.fullCalendar('removeEvents');
        $calendar.fullCalendar('addEventSource', [{
          title: data.summary,
          start: data.start.dateTime
        }]);
      });
    };


    let processInput = (input1, input2) => {
      let type = 1;

      // share to facebook if checked
      if (input1.is(':checked')) {
        console.log('todo: share on facebook');
      };

      // save event if checked
      if (input2.is(':checked')) {
        type = 2;
        CalendarCtrl.createEvent({
          hospitalId: hospitalId,
          time: CalendarCtrl.view.time.start
        });
      }

      // save appointment
      Appointment.post({
        hospitalId: hospitalId,
        time: CalendarCtrl.view.time.start,
        type: type
      }).then(res => {
        pushToGoogle({
          summary: 'Your appointment',
          start: {
            dateTime: CalendarCtrl.view.time.start,
            timeZone: 'UTC'
          },
          end: {
            dateTime: CalendarCtrl.view.time.start,
            timeZone: 'UTC'
          }
        });
      })
      .catch(err => {
        console.error('error in making appointment! ', err);
      });
    }

    let setView = (calEvent) => {
      let month = calEvent.start.month() + 1;
      let date = calEvent.start.date();
      let hour = calEvent.start.hour();
      let minute = calEvent.start.minutes();
      minute = minute < 10 ? minute + '0' : minute;

      CalendarCtrl.view.time.start = calEvent.start;
      CalendarCtrl.view.time.end = calEvent.end;
      CalendarCtrl.view.time.print = `${month}/${date} @ ${hour}:${minute}`;
    };


    $calendar.fullCalendar({
      timezone: 'local',
      displayEventEnd: true,
      events: (start, end, timezone, callback) => {
        hospitalId ? donorView(callback) : hospitalView(callback);
      },
      eventClick: (calEvent, jsEvent, view) => {
        if (CalendarCtrl.isHospital) {
          if (calEvent.data.donorId) {
            $window.location.assign(`/profile/${calEvent.data.donorId}`);
          } else {
            $window.location.assign(`/event/${calEvent.data.id}`);
          }
          return;
        }

        // this should be less hack-ish
        if (calEvent.title === 'Slot Available') {
          let $box1 = $('.modal.box1');
          let $box3 = $('.modal.box3');
          setView(calEvent);
          $scope.$apply();
         //blood buddy
          if(CalendarCtrl.buddy){
            $box3.modal();
          } else {
            $box1.modal();
          }
        }
        // same here
        if (calEvent.title === 'Your appointment') {
          $window.location.assign(`/hospital/profile/${hospitalId}`);
        }
      }
    });

    CalendarCtrl.googleSignin = () => {
      Calendar.getUrl().then(res => {
        console.log(res);
        let newWindow = $window.open(res.data, 'AuthPage', 'width=500px,height=700px');
        // e.data is a string with the code
        $window.onmessage = (e) => {
          let index = e.data.lastIndexOf('code=');
          let code = e.data.substring(index + 5).replace('#', '');
          newWindow.close();
          Calendar.getToken(code).then(res => {
            $calendar.fullCalendar('refetchEvents');
          });
        };
      });
    };

    CalendarCtrl.reload = () => {
      $calendar.fullCalendar('refetchEvents');
    };

    CalendarCtrl.createEvent = (data) => {
      if (!CalendarCtrl.isHospital) {
        Event.post(data).then(res => {
          if (!CalendarCtrl.eventsChecked) {
            $calendar.fullCalendar('refetchEvents');
          }
        }).catch(err => {
          console.error('error in createEvent', err);
        })
      } else {
        Event.post({
          time: CalendarCtrl.dateTime
        }).then(res => {
          $calendar.fullCalendar('refetchEvents');
        }).catch(err => {
          console.error('error in createEvent', err);
        })
      }
    };

    CalendarCtrl.firstModal = () => {
      let $box2 = $('.modal.box2');
      let $inputs = $('.modal').find('input');
      $inputs.each((index, input) => {
        input.checked = false;
      });
      $box2.modal();
    };

//blood buddy

    CalendarCtrl.buddyoneModal = () => {

      let $box4 = $('.modal.box4');
      let $inputs = $('.modal').find('input');
      Buddy.requestBuddy(CalendarCtrl.view.time.start, $routeParams.hospitalid)
      .then(buddy => {
        let content = "Looking for a buddy on" + " " + CalendarCtrl.view.time.print +" " + "https://bloodshare.io/bloodbuddy/"+buddy.id ;
        Feed.submit(content, {latitude: $rootScope.latitude, longitude: $rootScope.longitude});
         $window.location.assign(`#bloodbuddy/${buddy.id}`);
      });

    };


    CalendarCtrl.secondModal = () => {
      let $input1 = $('.checkbox.input1').find('input');
      let $input2 = $('.checkbox.input2').find('input');
      CalendarCtrl.eventsChecked = true;
      processInput($input1, $input2);
    };


  }]);
})();
