'use strict'

angular.module('app')
  .controller 'MineralCtrl', ['$http', '$log', '$scope', ($http, $log, $scope) ->
    $scope.chart =
      src: ''
      data: []
      loading: true
      index: "Year"
      series: []
      exclude: ["Imports", "Exports", "Stocks", "Unit value (98$/t)", "Unit value ($/t)"]

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
        parseInt(row[$scope.chart.index])

    $scope.getStatistics = (src) ->
      # $scope.chart.loading = true
      $http.get(src)
        .success (csv) ->
          [csv, header, footer] = dataRows(csv)  # TODO Do this on backend
          result = Papa.parse csv,
            header: true
            dynamicTyping: true
          series = _.filter result.meta.fields, (col) ->
            col not in _.flatten [$scope.chart.index, $scope.chart.exclude]
          series.push("Scipy Estimated")
          $scope.chart.series = series
          $scope.chart.header = header or []
          $scope.chart.footer = footer or []
          $scope.chart.data = _.indexBy cleanup(result.data), $scope.chart.index
          $scope.chart.loading = false

    $scope.$watch 'chart.src', (src, old) ->
      # $log.info "Watching chart.src:", src, old
      return unless src
      $scope.getStatistics(src)
  ]
