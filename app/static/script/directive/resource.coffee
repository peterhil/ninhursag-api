'use strict'

angular.module('app')
  .directive 'resource', ['$log', 'api', ($log, api) ->
    restrict: 'A'
    templateUrl: '/static/template/resource.html'
  ]
