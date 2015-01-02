'use strict'

angular.module('app')
  .factory 'api', ['$http', 'config', ($http, config) ->
    new class api
      url: (args...) ->
        R.join('/', R.concat(['/', config.api_server, 'api/v1'], args))

      estimate: (data) ->
        $http.post @url('estimate'), data
  ]
