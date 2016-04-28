let app = angular.module('blood', ['ngRoute'])

.config(function ($routeProvider, $httpProvider) {
  $routeProvider


  .when('/', {
    templateUrl: 'bloodMap/bloodMap.html',
    controller: 'BloodMapController',
    controllerAs: 'BloodMapCtrl'
  })

  .when('/profile', {
      templateUrl: 'profile/profile.html',
      controller: 'ProfileController',
      controllerAs: 'ProfileCtrl'
  })
  .when('/landing', {
    templateURL: 'landing/landing.html',
    controller: 'LandingController',
    controllerAs: 'LandingCtrl'

  })

  .otherwise({
      redirectTo: '/'
  });


});
