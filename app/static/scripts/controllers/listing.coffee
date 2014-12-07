'use strict'

angular.module('app')
  .controller 'ListingCtrl', ['$scope', '$http', ($scope, $http) ->
    $scope.loaded = false

    $http.get('/api/v1/items')
      .success (response) ->
        $scope.loaded = true
        $scope.things = response.items
      .error (response) ->
        $scope.loaded = true
        $scope.error = true
  ]
