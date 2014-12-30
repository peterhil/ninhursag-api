'use strict'

angular.module('app')
  .factory 'api', ['$http', 'config', ($http, config) ->
    new class api
      url: (args...) ->
        _.flatten([['/', config.api_server, 'api/v1'], args]).join '/'

      estimate: (data) ->
        $http.post @url('estimate'), data
  ]
