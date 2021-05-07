import {
    all,
    concat,
    fromPairs,
    is,
    mapObjIndexed,
    mergeDeepWith,
} from 'ramda'

export function concatOrMerge (a, b) {
    if (all(is(Array), [a, b])) {
        return concat(a, b)
    } else {
        return b || a
    }
}

export const mergeChartData = mergeDeepWith(concatOrMerge)

export function toChartData (series, data) {
    const indexer = (value, year) => {
        return fromPairs([
            ['Year', parseInt(year)],
            [series, parseFloat(value)],  // TODO Maybe check with isFinite?
        ])
    }

    return mapObjIndexed(indexer, data)
}
