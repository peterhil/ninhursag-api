'use strict'

angular.module('app')
  .controller 'MineralCtrl', ['$cookies', '$http', '$log', '$scope', 'Functional', ($cookies, $http, $log, $scope, Fx) ->
    $scope.chart =
      src: ''
      data: []
      loading: true
      index: "Year"
      series: []
      exclude: [
        "Imports", "Exports", "Stocks",
        # "Apparent consumption",
        "Unit value (98$/t)", "Unit value ($/t)",
      ]

    $scope.minerals = {}
    $scope.mineral = ''
    $http.get('/api/v1/minerals')
      .success (response) ->
        $scope.minerals = response
        $scope.mineral = if ($cookies.mineral in R.keys($scope.minerals)) then $cookies.mineral else 'Gold'
        $scope.chart.src = "/static/data/tsv/#{$scope.minerals[$scope.mineral]}"

    $scope.functions = {}
    $scope.currentFunction = 'powerlognorm'
    $http.get('/api/v1/estimate')
      .success (response) ->
        $scope.functions = response

    $http.get('/api/v1/reserves')
      .success (response) ->
        $scope.reserves = response

    $http.get('/api/v1/images')
      .success (response) ->
        $scope.images = response

    productionSeries = (series) ->
      production = R.match /(World.+production|(P|p)roduction|Total)/
      estimated = R.match /\(estimated\)$/
      R.findLast(
        R.allPredicates([production, R.not(estimated)])
        R.sortBy(R.I, series)
      )

    $scope.chart.selectedSeries = productionSeries($scope.chart.series)

    isData = (row) ->
      isIndex = R.match RegExp("^(\\d{4}|#{$scope.chart.index})$")
      !! R.find(isIndex, row)

    dataRows = (csv) ->
      parsed = Papa.parse csv,
          header: false
          dynamicTyping: false
      rows = parsed.data
      header = R.takeWhile R.not(isData), rows
      data = R.takeWhile isData, R.skip(header.length, rows)
      footer = R.skip(header.length + data.length, rows)
      data = R.join "\n", R.map(R.join("\t"), data)
      clean = R.compose R.filter(R.I), R.flatten
      [data, clean(header), clean(footer)]

    $scope.getStatistics = (src) ->
      # $scope.chart.loading = true
      $http.get(src)
        .success (csv) ->
          [csv, header, footer] = dataRows(csv)  # TODO Do this on backend
          result = Papa.parse csv,
            header: true
            dynamicTyping: true
          series = Fx.filterItems R.append($scope.chart.index, $scope.chart.exclude), result.meta.fields
          # series.push("Scipy Estimated")
          # $log.info('Data:', series, result, header, footer)
          $scope.chart.series = series
          $scope.chart.header = header or []
          $scope.chart.footer = footer or []
          $scope.chart.data = Fx.indexBy $scope.chart.index, result.data
          $scope.chart.loading = false

    $scope.$watch 'mineral', (val, old) ->
      src = $scope.minerals[val]
      # $log.info "Watching mineral:", val, old
      return unless src
      $cookies['mineral'] = val
      $scope.chart.src = "/static/data/tsv/#{src}"

    $scope.$watch 'chart.series', (val, old) ->
      $scope.chart.selectedSeries = productionSeries(val)

    $scope.$watch 'chart.src', (src, old) ->
      # $log.info "Watching chart.src:", src, old
      return unless src
      $scope.getStatistics(src)
  ]
