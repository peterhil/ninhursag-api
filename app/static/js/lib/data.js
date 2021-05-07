import {
    all,
    concat,
    fromPairs,
    is,
    map,
    mapObjIndexed,
    mergeDeepWith,
    props,
    values,
} from 'ramda'

export function concatOrMerge (a, b) {
    if (all(is(Array), [a, b])) {
        return concat(a, b)
    } else {
        return b || a
    }
}

export const mergeChartData = mergeDeepWith(concatOrMerge)

// Convert chart data by column to column series
export function toDataSeries (column, data) {
    return fromPairs(map(props(['Year', column]), values(data)))
}

// Convert column series to chart data
export function toChartData (series, data) {
    const indexer = (value, year) => {
        return fromPairs([
            ['Year', parseInt(year)],
            [series, parseFloat(value)],  // TODO Maybe check with isFinite?
        ])
    }

    return mapObjIndexed(indexer, data)
}
