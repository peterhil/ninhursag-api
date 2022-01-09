'use strict'

angular.module('app')
  .controller 'ListingCtrl', ['$scope', '$http', 'growl', 'config', ($scope, $http, growl, config) ->
    $scope.loading = true

    $http.get('/api/v1/items')
      .then(
        (response) ->
          $scope.loading = false
          growl.info("<strong>Success</strong> Items loaded.")
          $scope.things = response.data.items
        (error) ->
          $scope.loading = false
          growl.error("Failed loading items!")
          $scope.error = true
      )
  ]
