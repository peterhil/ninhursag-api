'use strict'

angular.module('app')
  .factory 'api', [() ->
    new class api
      url: (args...) ->
        R.join('/', R.concat(['/api/v1'], args))

      estimate: (data) ->
        $.ajax(@url('estimate'), {
            data: JSON.stringify(data),
            contentType: 'application/json',
            dataType: 'json',
            method: 'POST',
        })
  ]
