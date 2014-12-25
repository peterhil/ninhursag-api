'use strict'

angular.module('app')
  .factory 'api', ['$http', '$log', ($http, $log) ->
    new class api
      estimate: (data) ->
        $.ajax
          type: 'POST'
          url: ['/', '0.0.0.0:5000', 'api/v1', 'estimate'].join '/'
          data: data
          headers: {"Accept": "application/json", "Content-Type": "application/json"}
          dataType: 'json'
  ]
