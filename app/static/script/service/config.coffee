'use strict'

angular.module('app')
  .factory 'config', ['$http', '$log', ($http, $log) ->
    config = {}

    # TODO Use Gulp to generate config.js
    $http.get('/config.json', {async: false, cache: true})
      .success (response) =>
        $log.info 'Configuration loaded.'
        _.extend config, response
      .error (response) ->
        $log.error 'Could not load configuration!'

    config
  ]
