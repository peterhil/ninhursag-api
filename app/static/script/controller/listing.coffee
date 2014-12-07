'use strict'

angular.module('app')
  .controller 'ListingCtrl', ['$scope', '$http', 'growl', 'config', ($scope, $http, growl, config) ->
    $scope.loaded = false

    $http.get('/api/v1/items')
      .success (response) ->
        $scope.loaded = true
        growl.info("<strong>Success</strong> Items loaded.")
        $scope.things = response.items
      .error (response) ->
        $scope.loaded = true
        growl.error("Failed loading items!")
        $scope.error = true
  ]
