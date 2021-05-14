'use strict'

$(document).foundation()

angular
  .module('app', [
    'ngAnimate',
    # 'ngAria',
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
    '$locationProvider',
    '$httpProvider',
    '$logProvider',
    'growlProvider',
    (
      $routeProvider,
      $locationProvider,
      $httpProvider,
      $logProvider,
      growlProvider,
    ) ->
      # $locationProvider.html5Mode
      #   enabled: true
      #   requireBase: false
      $logProvider.debugEnabled false
      $routeProvider
        .when '/listing',
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
