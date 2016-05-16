let app = angular.module('blood', ['ngRoute', 'nvd3', 'rzModule'])

.config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
  $routeProvider


  .when('/bloodmap', {
    templateUrl: 'bloodMap/bloodMap.html',
    controller: 'BloodMapController',
    controllerAs: 'BloodMapCtrl'
  })

  .when('/profile', {
    templateUrl: 'profile/profile.html',
    controller: 'ProfileController',
    controllerAs: 'ProfileCtrl',
    resolve: {
      donor: ['Profile', function(Profile) {
        return Profile.get();
      }]
    }
  })
  .when('/profile/:donorid', {
    templateUrl: '/profile/profile_public.html',
    controller: 'ProfileController',
    controllerAs: 'ProfileCtrl',
    resolve: {
      donor: ['$route', 'Profile', function($route, Profile) {
        return Profile.get($route.current.params.donorid);
      }]
    }
  })
  .when('/hospital/signup', {
    templateUrl: 'hospital_auth/signup/signup.html',
    controller: 'HospitalAuthController',
    controllerAs: 'HospitalAuthCtrl'
  })
  .when('/hospital/login', {
    templateUrl: 'hospital_auth/login/login.html',
    controller: 'HospitalAuthController',
    controllerAs: 'HospitalAuthCtrl'
  })
  .when('/hospital/profile', {
    templateUrl: '/hospital_profile/profile.html',
    controller: 'HospitalProfileController',
    controllerAs: 'HospitalProfileCtrl',
    resolve: {
      currentHospital: ['HospitalProfile', function(HospitalProfile) {
        return HospitalProfile.get();
      }]
    }
  })
  .when('/hospital/profile/:hospitalid', {
    templateUrl: '/hospital_profile/profile_public.html',
    controller: 'HospitalProfileController',
    controllerAs: 'HospitalProfileCtrl',
    resolve: {
      currentHospital: ['$route', 'HospitalProfile', function($route, HospitalProfile) {
        return HospitalProfile.get($route.current.params.hospitalid);
      }]
    }
  })
  .when('/donor/login', {
    templateUrl: '/donor_auth/login/login.html',
    controller: 'DonorAuthController',
    controllerAs: 'DonorAuthCtrl'
  })
  .when('/donor/signup', {
    templateUrl: '/donor_auth/signup/signup.html',
    controller: 'DonorAuthController',
    controllerAs: 'DonorAuthCtrl'
  })
  .when('/stock', {
    templateUrl: 'stock/stock.html',
    controller: 'StockController',
    controllerAs: 'StockCtrl'
  })
  .when('/splash', {
    templateUrl: 'splash/splash.html',
    controller: 'SplashController',
    controllerAs: 'SplashCtrl'
  })
  .when('/calendar', {
    templateUrl: 'calendar/calendar.html',
    controller: 'CalendarController',
    controllerAs: 'CalendarCtrl'
  })
  .when('/calendar/:hospitalid', {
    templateUrl: '/calendar/calendar.html',
    controller: 'CalendarController',
    controllerAs: 'CalendarCtrl'
  })
  .when('/event/:eventId', {
    templateUrl: 'events/event.html',
    controller: 'EventController',
    controllerAs: 'EventCtrl',
    resolve: {
      event: ['$route', 'Event', function($route, Event) {
        return Event.get($route.current.params.eventId);
      }]
    }
  })
  .when('/bloodbuddy/:buddyId', {
    templateUrl: 'calendar/blood_buddy.html',
    controller: 'BuddyController',
    controllerAs: 'BuddyCtrl'
  })
  .otherwise({
    redirectTo: '/'
  });
}]);
