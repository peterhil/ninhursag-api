'use strict'

angular.module('app')
  .directive 'resource', ['$log', 'api', ($log, api) ->
    restrict: 'A'
    replace: true
    templateUrl: '/static/template/resource.html'
  ]
