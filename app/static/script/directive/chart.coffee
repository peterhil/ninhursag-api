'use strict'

angular.module('app')
  .directive 'chart', ['$cookies', '$log', 'Functional', 'api', 'growl', ($cookies, $log, Fx, api, growl) ->
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
      minerals: '='
      mineral: '='
      reserves: '='
    templateUrl: '/static/template/chart.html'
    link: (scope, element, attrs) ->
      scope.width ||= 400
      scope.height ||= 300
      scope.viewBox ||= "0 -20 #{scope.width} #{scope.height + 40}"
      scope.preserveAspectRatio ||= "xMidYMin meet"
      scope.chart.src = attrs.src
      scope.logscale = true
      scope['function'] = $cookies['function'] || scope['function']
      scope.mineral = $cookies.mineral || scope.mineral

      identity = ->
        if scope.logscale then 1 else 0

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

        excludeFromYMax = []
        unless scope.logscale
           excludeFromYMax.push 'Reserves'
        yMaxColumns = R.filter R.complement((i) -> R.contains(i, excludeFromYMax))

        scope.x = x = d3.scale.linear().range([0, scope.width])
        scope.y = y = (if scope.logscale then d3.scale.log() else d3.scale.linear()).range([scope.height, 0])

        x.domain(d3.extent(data, (row) -> parseInt(row[chart.index])))
        y.domain([identity(), d3.max(data, (row) -> R.reduce(R.max, identity(), (R.values(R.pick(yMaxColumns(chart.series), row)))))])

        scope.yLabel = (d) -> Humanize.compactInteger(d, 1)

        fixNaNs = (path) ->
          R.map(
            ((i) -> i.replace(/^[A-Z]/, 'M')),
            R.filter(R.identity, path.split(/[A-Z](?:\d+|\d+\.\d+),NaN/))
          ).join('')

        line = (column) ->
          d3.svg.line()
            .x((d, i) -> x(d[chart.index]))
            .y((d, i) -> y(parseFloat(d[column])))

        scope.line = (column) ->
          fixNaNs(line(column)(data))

      scope.estimate = (fn) ->
        return false if R.isEmpty(scope.chart.data)
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
              R.mapObjIndexed(
                (v, k) ->
                  r =
                    'Year': parseInt(k)
                  r[key] = if _.isFinite(parseFloat(v)) then R.max(parseFloat(v), identity()) else null
                  r
                , R.zipObj(response['years'], response['data']))
              )
            scope.chart.series.push(key)
            scope.chart.series = R.uniq scope.chart.series
            scope.chart.data = _.merge scope.chart.data, estimate
            scope.getReserves()
          # .error (response) ->
          #   growl.warning response.errors.join("\n")
          .catch (response) ->
            if response.data.errors?
              growl.error response.data.errors.join("\n")
            else
              growl.error "#{response.status} #{response.statusText}"

      scope.getReserves = ->
        mineral = scope.mineral
        data = scope.reserves.data[mineral]
        # $log.info "getReserves():", mineral, data
        return unless mineral and data

        latest = R.last R.sort R.lt, R.filter(R.identity, R.map(parseInt, R.keys(data)))
        reserveEstimate = data?[latest]
        reserveNotes = scope.reserves.notes[mineral]

        return unless parseFloat(reserveEstimate)

        total = 0
        last = 0
        cumulative = R.fromPairs R.map (year) ->
          amount = parseFloat(
            (last = scope.chart.data[year]["#{scope.chart.selectedSeries}"] or last) or
            scope.chart.data[year]["#{scope.chart.selectedSeries} (estimated)"]
          )
          # $log.info "Last amount:", year, last, amount
          if amount == identity()
            amount = last
          total += amount if amount
          [year, total]
        , R.keys(scope.chart.data)

        reserves = Fx.indexBy scope.chart.index, (R.mapObjIndexed (production, year) ->
          amount = R.max(reserveEstimate - (production - cumulative[latest]), identity())
          {
            Year: parseInt(year)
            Reserves: if _.isFinite(parseFloat(amount)) then parseFloat(amount) else null
          }
        , cumulative)

        # $log.info "Reserves estimation:", mineral, latest, Humanize.compactInteger(reserveEstimate, 3), reserveNotes

        # cumulativeIdx = Fx.indexBy scope.chart.index, (R.mapObjIndexed (production, year) ->
        #   amount = R.max(production, identity())
        #   {
        #     Year: parseInt(year)
        #     Cumulative: if _.isFinite(parseFloat(amount)) then parseFloat(amount) else null
        #   }
        # , cumulative)
        # $log.info "Cumulative world production:", cumulativeIdx
        # scope.chart.series.push "Cumulative"
        # scope.chart.series = R.uniq scope.chart.series
        # scope.chart.data = _.merge scope.chart.data, cumulativeIdx


        # $log.info "Reserves:", reserves
        scope.chart.series.push "Reserves"
        scope.chart.series = R.uniq scope.chart.series
        scope.chart.data = _.merge scope.chart.data, reserves

      fuzzyColor = (str) ->
        if (words = str.split(' ')).length > 1
          colors = R.map fuzzyColor, R.filter(R.identity, words)
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

      scope.$watch 'logscale', ->
        scope.render(scope.chart)

      scope.$watchCollection 'chart.data', (val, old) ->
        # $log.info "Watching chart.data:", val
        scope.estimate(scope.function)  # TODO makes double requests
        scope.render(scope.chart)

      scope.$watch 'function', (val, old) ->
        # $log.info "Watching function:", val, old
        return unless val
        $cookies['function'] = val
        scope.estimate(val)
        scope.render(scope.chart)
  ]
