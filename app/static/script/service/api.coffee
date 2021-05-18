'use strict'

angular.module('app')
  .factory 'api', ['$http', ($http) ->
    new class api
      url: (args...) ->
        R.join('/', R.concat(['/api/v1'], args))

      estimate: (data) ->
        $http.post @url('estimate'), data
  ]
