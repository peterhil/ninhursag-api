'use strict'

angular.module('app')
  .directive 'chart', ['$http', '$log', ($http, $log) ->
    restrict: 'E'
    replace: true
    # scope:
    #   data: '='
    template: '<svg ng-attr-viewBox="{{graph.viewBox}}"></svg>'
    link: (scope, element, attrs) ->
      width = attrs.width or 400
      height = attrs.height or 300
      scope.graph =
        width: width
        height: height
        viewBox: "0 0 #{width} #{height}"
        preserveAspectRatio: scope.preserveAspectRatio

      $http.get(attrs.src)
        .success (csv) ->
          result = Papa.parse csv,
            header: true
            dynamicTyping: true
          scope.data = result.data
          # $log.info "Loaded:", attrs.src, scope.data
  ]
