'use strict'

angular.module('app')
  .factory 'api', [() ->
    new class api
      url: (args...) ->
        R.join('/', R.concat(['/api/v1'], args))

      estimate: (data) ->
        $.post @url('estimate'), data
  ]
