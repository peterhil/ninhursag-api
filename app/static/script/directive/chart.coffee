'use strict'

angular.module('app')
  .directive 'chart', ['$http', '$log', 'api', 'growl', ($http, $log, api, growl) ->
    restrict: 'AE'
    replace: true
    scope:
      caption: '@'
      legend: '='
      index: '@'
      series: '='
      exclude: '='
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

      isData = (row) ->
        _.any(_.filter(_.map(
          row,
          (col) -> _.first(col.match(RegExp('^(\\d{4}|Year)$')))
          )))

      cleanRow = (row) ->
        _.map(row, (col) -> col.replace(/^( |")+|( |")+$/g, ''))

      dataRows = (csv) ->
        parsed = Papa.parse csv,
            header: false
            dynamicTyping: false
        rows = parsed.data
        header = _.filter(_.flatten(_.take(rows, (row) -> not isData(row))))
        data = _.take(rows.slice(header.length), isData)
        footer = _.filter(_.flatten(rows.slice(header.length + data.length)))
        data = _.map(data, (row) -> cleanRow(row).join("\t")).join("\n")
        [data, header, footer]

      cleanup = (data) ->
        _.filter data, (row) ->
          parseInt(row[scope.index])

      $http.get(attrs.src)
        .success (csv) ->
          [csv, header, footer] = dataRows(csv)  # TODO Do this on backend
          result = Papa.parse csv,
            header: true
            dynamicTyping: true
          series = _.without result.meta.fields, scope.index
          series = _.filter series, (s) -> s not in scope.exclude
          series.push("Scipy Estimated")
          scope.series = series
          scope.header = header or []
          scope.footer = footer or []
          scope.data = _.indexBy cleanup(result.data), scope.index
          scope.loading = false

      scope.render = (data) ->
        return unless data
        data = _.map(data)
        # $log.info "Render:", data

        # Workaround jQuery bug with camel cased attributes
        svg = element.find('svg')[0]
        svg.setAttribute('preserveAspectRatio', scope.preserveAspectRatio)
        svg.setAttribute('viewBox', scope.viewBox)
        svg.removeAttribute('preserveaspectratio')
        svg.removeAttribute('viewbox')

        x = d3.scale.linear().range([0, scope.width])
        y = d3.scale.linear().range([scope.height, 0])

        x.domain(d3.extent(data, (d) -> parseInt(d[scope.index])))
        y.domain([0, d3.max(data, (d) -> _.max(_.pick(d, _.filter(scope.series, (d) -> d not in [
          'Reserves',
          'Unit value (98$/t)',
          'Unit value ($/t)',
        ]))))])

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

        api.estimate(request_data)
          .success (response) ->
            estimate = _.indexBy(_.map(
              _.zipObject(response['years'], response['data']),
              (v, k) ->
                'Year': parseInt(k)
                'Scipy Estimated': parseFloat(v)
              ), 'Year')
            scope.data = _.merge scope.data, estimate
          # .error (response) ->
          #   growl.warning response.errors.join("\n")
          .catch (response) ->
            if response.data.errors?
              growl.error response.data.errors.join("\n")
            else
              growl.error "#{response.status} #{response.statusText}"

      scope.$watchCollection 'data', (data, old) ->
        # $log.info "Watching data: changed", data, old
        scope.render(data)
  ]
