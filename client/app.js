let app = angular.module('blood', ['ngRoute', 'nvd3'])

.config(function ($routeProvider, $httpProvider) {
  $routeProvider


  .when('/bloodmap', {
    templateUrl: 'bloodMap/bloodMap.html',
    controller: 'BloodMapController',
    controllerAs: 'BloodMapCtrl'
  })

  .when('/profile', {
      templateUrl: 'profile/profile.html',
      controller: 'ProfileController',
      controllerAs: 'ProfileCtrl'
  })
  .when('/profile/:donorid', {
      templateUrl: '/profile/profile_public.html',
      controller: 'ProfileController',
      controllerAs: 'ProfileCtrl'
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
    controllerAs: 'HospitalProfileCtrl'
  })
  .when('/hospital/profile/:hospitalid', {
    templateUrl: '/hospital_profile/profile_public.html',
    controller: 'HospitalProfileController',
    controllerAs: 'HospitalProfileCtrl'
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
    templateUrl: 'splash/splash.html'
  })
  .when('/calendar', {
    templateUrl: 'calendar/calendar.html',
    controller: 'CalendarController',
    controllerAs: 'CalendarCtrl'
  })
  .otherwise({
      redirectTo: '/'
  });


});
