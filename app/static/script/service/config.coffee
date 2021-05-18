'use strict'

angular.module('app')
  .factory 'config', ['$http', '$log', ($http, $log) ->
    config = {}


    # TODO Use Gulp to generate config.js
    $http.get('/config.json', {async: false, cache: true})
      .then(
        (response) ->
          $log.debug 'Configuration loaded.'
          _.extend config, response.data
        (error) ->
          $log.error 'Could not load configuration!'
      )

    config
  ]
