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
    '$httpProvider',
    '$logProvider',
    'growlProvider',
    (
      $routeProvider,
      $httpProvider,
      $logProvider,
      growlProvider,
    ) ->
      $logProvider.debugEnabled false
      $routeProvider
        .when '/',
          templateUrl: 'static/view/listing.html'
          controller: 'ListingCtrl'
        .otherwise
          redirectTo: '/'
      growlProvider.globalPosition 'top-center'
      growlProvider.globalInlineMessages true
      growlProvider.globalTimeToLive
        success: 4000
        info: 4000
        warning: 8000
      growlProvider.globalDisableCountDown true
      growlProvider.globalDisableIcons true
      $httpProvider.interceptors.push(growlProvider.serverMessagesInterceptor)
  ]
