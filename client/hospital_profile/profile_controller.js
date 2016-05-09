app.controller('HospitalProfileController', ['$window', '$routeParams' ,  '$rootScope', '$scope', 'HospitalProfile', function($window, $routeParams, $rootScope, $scope, HospitalProfile) {
  let HospitalProfileCtrl = this;

  if ($routeParams.hospitalid) HospitalProfileCtrl.id = $routeParams.hospitalid;

  HospitalProfileCtrl.editObj = {};

  HospitalProfileCtrl.edit = false;
  HospitalProfileCtrl.Edit = function() {
    HospitalProfileCtrl.edit = !HospitalProfileCtrl.edit;
  };

  HospitalProfileCtrl.bloodTypes = [
  {display: 'A+', code: 'apos'},
  {display: 'A-', code: 'aneg'},
  {display: 'B+', code: 'bpos'},
  {display: 'B-', code: 'bneg'},
  {display: 'AB+', code: 'abpos'},
  {display: 'AB-', code: 'abneg'},
  {display: '0+', code: 'opos'},
  {display: 'O-', code: 'oneg'}
  ];

  HospitalProfileCtrl.schedule = [
    {
      
      day: 1,
      openhours: 9,
      closehours: 17,
    },
    { 
      
      day: 2,
      openhours: 9,
      closehours: 17,
    },
    {
      
      day: 3,
      openhours: 9,
      closehours: 17,
    },
    {
      
      day: 4,
      openhours: 9,
      closehours: 17,
    },
    {
      
      day: 5,
      openhours: 9,
      closehours: 17,
    },
    {
      
      day: 6,
      openhours: 9,
      closehours: 17,
    },
    {
      
      day: 7,
      openhours: 9,
      closehours: 17,
    }


  ];
 



  HospitalProfileCtrl.getlatlong = () => {
    let address = document.getElementById('address').value;
    console.log(address);
    // Initialize the Geocoder
    let geocoder = new google.maps.Geocoder();
    if (geocoder) {
      console.log(geocoder);

      geocoder.geocode({
        'address': address
      }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          console.log(results);
          HospitalProfileCtrl.editObj.latitude = results[0].geometry.location.lat();
          HospitalProfileCtrl.editObj.longitude = results[0].geometry.location.lng();
        }
      });
    }
  };


  HospitalProfileCtrl.update = () => {
    HospitalProfileCtrl.editObj.schedules = HospitalProfileCtrl.schedule;
    console.log(HospitalProfileCtrl.editObj);
    HospitalProfile.update(HospitalProfileCtrl.editObj)
    .then(hospital => {HospitalProfileCtrl.editObj = hospital; displayHospital();});
  };

  let displayHospital = () => {
    HospitalProfile.get(HospitalProfileCtrl.id)
    .then((hospital) => {
      HospitalProfileCtrl.editObj = hospital;
      $scope.data[0].values[0].value = HospitalProfileCtrl.editObj.opos;
      $scope.data[0].values[1].value = HospitalProfileCtrl.editObj.oneg;
      $scope.data[0].values[2].value = HospitalProfileCtrl.editObj.apos;
      $scope.data[0].values[3].value = HospitalProfileCtrl.editObj.aneg;
      $scope.data[0].values[4].value = HospitalProfileCtrl.editObj.bpos;
      $scope.data[0].values[5].value = HospitalProfileCtrl.editObj.bneg;
      $scope.data[0].values[6].value = HospitalProfileCtrl.editObj.abpos;
      $scope.data[0].values[7].value = HospitalProfileCtrl.editObj.abneg;
      getReviews();
    });
  };

  HospitalProfileCtrl.reviews = [];
  let getReviews = () => {
    if (HospitalProfileCtrl.id || HospitalProfileCtrl.editObj.id) {
      if(!HospitalProfileCtrl.id) {
        HospitalProfileCtrl.id = HospitalProfileCtrl.editObj.id;
        console.log(HospitalProfileCtrl.editObj)
      }
      HospitalProfile.getReviews(HospitalProfileCtrl.id)
      .then(reviews => HospitalProfileCtrl.reviews = reviews);
    }
  };


  HospitalProfileCtrl.submitReview = () => {
    HospitalProfile.postReview(HospitalProfileCtrl.id, HospitalProfileCtrl.reviewContent)
    .then(getReviews);
  };


  displayHospital();
  getReviews();

      ////////////////////////////////////////
      //       BEHOLD, THE FORBIDDEN ZONE.
      ////////////////////////////////////////


      $scope.options = {
        chart: {
          type: 'discreteBarChart',
          height: 200,
          x: function(d){return d.label;},
          y: function(d){return d.value;},
          showValues: true,
          color: function(){return '#700000';},
          valueFormat: function(d){ return d3.format(',f')(d); },
          dispatch: {
          
          },
          discretebar: {
            dispatch: {
              elementClick: function(e) {$scope.$apply();}
              }
            },
          callback: function(e){console.log('! callback !')}
        }
      };

      $scope.data = [
        {
          key: "Blood Levels",
          values: [
                  {
                    "label" : "O+" ,
                    "value" : 6
                  },
                  {
                    "label" : "O-" ,
                    "value" : 5
                  },
                  {
                    "label" : "A+" ,
                    "value" : 18
                  },
                  {
                    "label" : "A-" ,
                    "value" : 8
                  },
                  {
                    "label" : "B+" ,
                    "value" : 17
                  },
                  {
                    "label" : "B-" ,
                    "value" : 7
                  },
                  {
                    "label" : "AB+" ,
                    "value" : 16
                  },
                  {
                    "label" : "AB-" ,
                    "value" : 6
                  }
          ]
        }
      ];

      ////////////////////////////////////////
      //  FAREWELL, FROM THE FORBIDDEN ZONE.
      ////////////////////////////////////////
}]);
