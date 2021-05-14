'use strict'

angular.module('app')
  .factory 'config', ['$log', ($log) ->
    config = {}

    # TODO Use Gulp to generate config.js
    $.getJSON('/config.json', {async: false, cache: true})
      .done (response) =>
        $log.debug 'Configuration loaded.'
        _.extend config, response
      .fail (response) ->
        $log.error 'Could not load configuration!'

    config
  ]
