'use strict'

$(document).foundation()

angular
  .module('app', [
    'ngAnimate',
    # 'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    # 'ngTouch',
    'angular-growl',
    'angularSpinner',
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
          templateUrl: '/static/view/listing.html'
          controller: 'ListingCtrl'
        .otherwise
          redirectTo: '/'
      growlProvider.globalPosition 'top-center'
      growlProvider.globalInlineMessages true
      growlProvider.globalTimeToLive
        success: 4000
        info: 4000
        warning: 4000
        error: 4000
      growlProvider.globalDisableCountDown true
      growlProvider.globalDisableIcons true
      $httpProvider.interceptors.push(growlProvider.serverMessagesInterceptor)
  ]
