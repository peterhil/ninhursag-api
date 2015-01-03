'use strict'

angular.module('app')
  .directive 'chart', ['$log', 'Functional', 'api', 'growl', ($log, Fx, api, growl) ->
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
      function: '='
      estimate: '='
    templateUrl: '/static/template/chart.html'
    link: (scope, element, attrs) ->
      scope.width ||= 400
      scope.height ||= 300
      scope.viewBox ||= "0 0 #{scope.width} #{scope.height}"
      scope.preserveAspectRatio ||= "xMidYMid meet"
      scope.chart.src = attrs.src

      scope.render = (chart) ->
        return unless chart.data
        data = R.values(chart.data)
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

        excludeFromYMax = [
          'Reserves',
        ]
        yMaxColumns = R.filter R.not(R.contains(excludeFromYMax))

        x.domain(d3.extent(data, (row) -> parseInt(row[chart.index])))
        y.domain([0, d3.max(data, (row) -> R.max(R.values(R.pick(yMaxColumns(chart.series), row))))])

        scope.yLabel = (d) -> Humanize.compactInteger(d, 1)

        line = (column) ->
          d3.svg.line()
            .x((d, i) -> x(d[chart.index]))
            .y((d, i) -> y(parseFloat(d[column]) or 0))

        scope.line = (column) ->
          line(column)(data)

      scope.estimate = (fn) ->
        request_data =
          'years': []
          'data': []
          'function': fn
        R.map((row) ->
          index = parseInt(row[scope.chart.index])
          data = parseFloat(row[scope.chart.selectedSeries])
          if index and data
            request_data.years.push index
            request_data.data.push data
        , R.values(scope.chart.data))

        api.estimate(request_data)
          .success (response) ->
            key = "#{scope.chart.selectedSeries} (estimated)"
            estimate = Fx.indexBy(scope.chart.index,
              R.mapObj.idx(
                (v, k) ->
                  r =
                    'Year': parseInt(k)
                  r[key] = if _.isFinite(parseFloat(v)) then parseFloat(v) else null
                  r
                , R.zipObj(response['years'], response['data']))
              )
            scope.chart.series.push(key)
            scope.chart.series = R.uniq scope.chart.series
            scope.chart.data = _.merge scope.chart.data, estimate
          # .error (response) ->
          #   growl.warning response.errors.join("\n")
          .catch (response) ->
            if response.data.errors?
              growl.error response.data.errors.join("\n")
            else
              growl.error "#{response.status} #{response.statusText}"

      fuzzyColor = (str) ->
        if (words = str.split(' ')).length > 1
          colors = R.map fuzzyColor, R.filter(R.I, words)
          return R.reduce tinycolor.mix, R.head(colors), R.tail(colors)
        sndx = soundexPhonetics(str or ' ')
        # hue = (sndx[0].charCodeAt() % 64)  * (360 / 64) # modulo is for unicode chars. Or 360?
        # hue = (((sndx[0].charCodeAt() - (65)) + 26) % 26) * (360 / 26)
        hue = (((sndx[0].charCodeAt())) % 26) * (360 / 26)
        sat = parseInt(sndx.slice(1, 3), 7) * (50 / 48) + 25    # 0...48 => 50...100
        lig = parseInt(sndx.slice(3, 4), 7) * (50 / 6) + 50   # 0..6 => 50...100 (minus word length)
        lig -= Math.min(50, str.length)
        tinycolor({ h: hue, s: sat, l: lig })

      scope.seriesStyle = (serie) ->
        stroke: fuzzyColor(serie).toHexString()
        strokeDasharray: '6, 2' if serie.match /\(estimated\)/

      scope.$watchCollection 'chart.data', (val, old) ->
        # $log.info "Watching chart.data:", val
        scope.estimate(scope.function)  # TODO makes double requests
        scope.render(scope.chart)

      scope.$watch 'function', (val, old) ->
        $log.info "Watching function:", val, old
        return unless val
        scope.estimate(val)
        scope.render(scope.chart)
  ]
