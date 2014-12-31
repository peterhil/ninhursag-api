'use strict'

angular.module('app')
  .directive 'chart', ['$log', 'api', 'growl', ($log, api, growl) ->
    restrict: 'AE'
    require: 'ngModel'
    replace: true
    scope:
      caption: '@'
      legend: '='
      width: '=width'
      height: '=height'
      preserveAspectRatio: '@preserveaspectratio'
      viewBox: '@viewbox'
      chart: '=ngModel'
    templateUrl: '/static/template/chart.html'
    link: (scope, element, attrs) ->
      scope.width ||= 400
      scope.height ||= 300
      scope.viewBox ||= "0 0 #{scope.width} #{scope.height}"
      scope.preserveAspectRatio ||= "xMidYMid meet"
      scope.chart.src = attrs.src

      scope.render = (chart) ->
        return unless chart.data
        data = _.map(chart.data)
        # $log.info "Render:", data, chart.index, chart.series

        # Workaround jQuery bug with camel cased attributes
        svg = element.find('svg')[0]
        if svg
          svg.setAttribute('preserveAspectRatio', scope.preserveAspectRatio)
          svg.setAttribute('viewBox', scope.viewBox)
          svg.removeAttribute('preserveaspectratio')
          svg.removeAttribute('viewbox')

        scope.x = x = d3.scale.linear().range([0, scope.width])
        scope.y = y = d3.scale.linear().range([scope.height, 0])

        x.domain(d3.extent(data, (d) -> parseInt(d[chart.index])))
        y.domain([0, d3.max(data, (d) -> _.max(_.pick(d, _.filter(chart.series, (d) -> d not in [
          'Reserves',
          'Unit value (98$/t)',
          'Unit value ($/t)',
        ]))))])

        scope.yLabel = (d) -> Humanize.compactInteger(d, 1)

        line = (column) ->
          d3.svg.line()
            .x((d, i) -> x(d[chart.index]))
            .y((d, i) -> y(parseFloat(d[column]) or 0))

        scope.line = (column) ->
          line(column)(data)

      scope.test2 = ->
        scope.chart.src = "/data/ds140-bauxi-clean.csv"

      scope.test = ->
        request_data =
          'years': _.map(scope.chart.data, (row) -> parseInt(row[scope.chart.index]))
          'data': _.map(scope.chart.data, (row) -> parseFloat(row['World production']))

        api.estimate(request_data)
          .success (response) ->
            estimate = _.indexBy(_.map(
              _.zipObject(response['years'], response['data']),
              (v, k) ->
                'Year': parseInt(k)
                'Scipy Estimated': parseFloat(v)
              ), 'Year')
            scope.chart.data = _.merge scope.chart.data, estimate
          # .error (response) ->
          #   growl.warning response.errors.join("\n")
          .catch (response) ->
            if response.data.errors?
              growl.error response.data.errors.join("\n")
            else
              growl.error "#{response.status} #{response.statusText}"

      scope.$watchCollection 'chart.data', (val, old) ->
        # $log.info "Watching chart.data:", val
        scope.render(scope.chart)
  ]
