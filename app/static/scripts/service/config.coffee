'use strict'

angular.module('app')
  .factory 'config', ['$http', ($http) ->
    @config = {}

    # TODO Use Gulp to generate config.js
    $http.get('/config.json', {async: false})
      .success (response) =>
        @config = response
      .error (response) ->
        console.error "Could not load configuration!"

    get: =>
      @config
  ]
