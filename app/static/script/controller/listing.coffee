'use strict'

angular.module('app')
  .controller 'ListingCtrl', ['$scope', '$http', 'growl', ($scope, $http, growl) ->
    $scope.loaded = false

    $http.get('/api/v1/items')
      .success (response) ->
        $scope.loaded = true
        growl.addInfoMessage("Items loaded.")
        $scope.things = response.items
      .error (response) ->
        $scope.loaded = true
        growl.addErrorMessage("Failed loading items!")
        $scope.error = true
  ]
