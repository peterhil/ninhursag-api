'use strict'

angular.module('app').controller 'MineralCtrl', [
  '$http',
  '$log',
  '$scope',
  'Functional',
  '$routeParams',
  '$location',
  (
    $http,
    $log,
    $scope,
    Fx,
    $routeParams,
    $location,
  ) ->
    $scope.chart =
      src: ''
      data: null
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
      .then (response) ->
        $scope.minerals = response.data
        if ($routeParams.mineral == 'statistics') and (Cookies.get('mineral') in R.keys($scope.minerals))
          mineral = Cookies.get('mineral')
          $log.info 'Using cookies for mineral:', mineral
        else if $routeParams.mineral in R.keys($scope.minerals)
          mineral = $routeParams.mineral
          $log.info 'Using route params for mineral:', mineral
        else
          mineral = 'Silver'
          $log.info 'Using default mineral:', mineral
        $scope.mineral = mineral
        $scope.chart.src = "/static/data/tsv/#{$scope.minerals[$scope.mineral]}"

    $scope.functions = {}
    $scope.currentFunction = 'powerlognorm'
    $scope.fn = 'powerlognorm'
    $http.get('/api/v1/estimate')
      .then (response) ->
        $scope.functions = response.data

    $http.get('/api/v1/reserves')
      .then (response) ->
        $scope.reserves = response.data

    $http.get('/api/v1/images')
      .then (response) ->
        $scope.images = response.data

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
        .then (response) ->
          csv = response.data
          [csv, header, footer] = dataRows(csv)  # TODO Do this on backend
          result = Papa.parse csv,
            header: true
            dynamicTyping: true
          series = Fx.filterItems R.append($scope.chart.index, $scope.chart.exclude), result.meta.fields
          $scope.chart.selectedSeries = productionSeries(series)
          $scope.chart.series = series
          $scope.chart.header = header or []
          $scope.chart.footer = footer or []
          $scope.chart.data = Fx.indexBy $scope.chart.index, result.data
          $scope.chart.loading = false

    $scope.$watch 'mineral', (val, old) ->
      src = $scope.minerals[val]
      guard = not val or not src or (val is old)
      return if guard

      $log.info "Mineral:", val
      $scope.chart.src = "/static/data/tsv/#{src}"
      $location.url('/mineral/' + encodeURI(val))
      Cookies.set('mineral', val, {
        path: '', # Current path
        sameSite: 'strict',
      })

    $scope.$watchCollection 'chart.series', (val, old) ->
      return if not val or val is old
      # $log.info "Chart series:", val
      $scope.chart.selectedSeries = productionSeries(val)

    $scope.$watch 'chart.src', (src, old) ->
      return if not src or src is old
      $log.info "Chart source:", src
      $scope.getStatistics(src)
]
