'use strict'

angular.module('app')
  .factory 'Functional', ['$log', ($log)->
    new class Functional
      ###
      Invert object keys and values
      ###
      invert: R.compose R.fromPairs, R.map(R.reverse), R.toPairs

      ###
      Given a list of objects as 'items', construct an object indexed by 'idx'
      ###
      indexBy: R.curry (idx, items) ->
        if 'Object' == R.type(items)
          items = R.values(items)
        R.zipObj(R.pluck(idx, items), R.values(items))

      ###
      Filter out the array of excluded items
      ###
      filterItems: R.curry (excluded, items) ->
        R.filter ((d) -> d not in excluded), items
  ]
