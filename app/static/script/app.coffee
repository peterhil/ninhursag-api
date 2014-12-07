'use strict'

angular
  .module('app', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'angular-growl',
  ])
  .config [
    '$routeProvider',
    '$logProvider',
    'growlProvider',
    (
      $routeProvider,
      $logProvider,
      growlProvider,
    ) ->
      $logProvider.debugEnabled false
      $routeProvider
        .when '/',
          templateUrl: 'static/views/listing.html'
          controller: 'ListingCtrl'
        .otherwise
          redirectTo: '/'
      growlProvider.globalTimeToLive(5000);
  ]
