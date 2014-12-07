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
    'ngTouch'
  ])
  .config ['$routeProvider', '$logProvider', ($routeProvider, $logProvider) ->
    $logProvider.debugEnabled false
    $routeProvider
      .when '/',
        templateUrl: 'static/views/listing.html'
        controller: 'ListingCtrl'
      .otherwise
        redirectTo: '/'
  ]
