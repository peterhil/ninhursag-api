'use strict'

angular.module('app')
  .directive 'chart', ['$http', '$log', ($http, $log) ->
    restrict: 'AE'
    replace: true
    scope:
      caption: '@'
      legend: '='
      index: '@'
      series: '='
      width: '=width'
      height: '=height'
      preserveAspectRatio: '@preserveaspectratio'
      viewBox: '@viewbox'
    templateUrl: '/static/template/chart.html'
    link: (scope, element, attrs) ->
      scope.width ||= 400
      scope.height ||= 300
      scope.viewBox ||= "0 0 #{scope.width} #{scope.height}"
      scope.preserveAspectRatio ||= "xMidYMid meet"
      scope.loading = true

      cleanup = (data) ->
        _.filter(data, (row) -> parseInt(row[scope.index]))

      $http.get(attrs.src)
        .success (csv) ->
          result = Papa.parse csv,
            header: true
            dynamicTyping: true
          scope.data = _.indexBy cleanup(result.data), scope.index
          scope.loading = false

      scope.render = (data) ->
        return unless data
        data = _.map(data)
        $log.info "Data changed:", data

        # Workaround jQuery bug with camel cased attributes
        svg = element.find('svg')[0]
        svg.setAttribute('preserveAspectRatio', scope.preserveAspectRatio)
        svg.setAttribute('viewBox', scope.viewBox)
        svg.removeAttribute('preserveaspectratio')
        svg.removeAttribute('viewbox')

        x = d3.scale.linear().range([0, scope.width])
        y = d3.scale.linear().range([scope.height, 0])

        x.domain(d3.extent(data, (d) -> parseInt(d[scope.index])))
        y.domain([0, d3.max(data, (d) -> _.max(_.pick(d, _.filter(scope.series, (d) -> d not in ['Reserves']))))])

        line = (column) ->
          d3.svg.line()
            .x((d, i) -> x(d[scope.index]))
            .y((d, i) -> y(parseFloat(d[column]) or 0))

        # Grid and axes
        scope.x = (d) -> x(d)
        scope.y = (d) -> y(d)
        scope.xticks = (n) -> x.ticks(n)
        scope.yticks = (n) -> y.ticks(n)

        scope.line = (column) ->
          line(column)(data)

      scope.test = ->
        request_data = JSON.stringify
          'years': _.map(scope.data, (row) -> parseInt(row[scope.index]))
          'data': _.map(scope.data, (row) -> parseFloat(row['World production']))

        $.ajax
          type: 'POST'
          url: ['/', '0.0.0.0:5000', 'api/v1', 'estimate'].join '/'
          data: request_data
          headers: {"Accept": "application/json", "Content-Type": "application/json"}
          dataType: 'json'
          success: (response) ->
            estimate = _.indexBy(_.map(
              _.zipObject(response['years'], response['data']),
              (v, k) ->
                'Year': parseInt(k)
                'Scipy Estimated': parseFloat(v)
              ), 'Year')
            scope.$apply(-> scope.data = _.merge scope.data, estimate)

      scope.$watchCollection 'data', (data, old) ->
        $log.info "Watching: data changed"
        scope.render(data)
  ]
