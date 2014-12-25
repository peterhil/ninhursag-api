'use strict'

angular.module('app')
  .factory 'api', ['$http', '$log', ($http, $log) ->
    new class api
      url: (args...) ->
        _.flatten([['/', '0.0.0.0:5000', 'api/v1'], args]).join '/'

      estimate: (data) ->
        $http.post @url('estimate'), data
  ]
