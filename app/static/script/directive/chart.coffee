'use strict'

angular.module('app')
  .directive 'chart', ['$http', '$log', ($http, $log) ->
    restrict: 'AE'
    replace: true
    scope:
      caption: '@'
      series: '='
      width: '=width'
      height: '=height'
      preserveAspectRatio: '@preserveAspectRatio'
      viewBox: '@viewBox'
    templateUrl: '/static/template/chart.html'
    link: (scope, element, attrs) ->
      scope.width ||= 400
      scope.height ||= 300
      scope.viewBox ||= "0 0 #{scope.width} #{scope.height}"
      scope.preserveAspectRatio ||= "xMidYMid meet"

      $http.get(attrs.src)
        .success (csv) ->
          result = Papa.parse csv,
            header: true
            dynamicTyping: true
          scope.data = result.data
          # $log.info "Loaded:", attrs.src, scope.data
  ]
