import { isFinite } from 'lodash'
import {
    all,
    concat,
    filter,
    fromPairs,
    identity,
    is,
    map,
    mapObjIndexed,
    mergeDeepWith,
    max,
    toPairs,
    transpose,
    zipObj,
} from 'ramda'

// Transform chart data format into object with arrays for years and data
export function dataForEstimate (series) {
    const numbers = filter(is(Number), series)
    const [years, data] = transpose(toPairs(numbers))

    // TODO Change API to accept series data with years as indices
    return {
        years: map(parseInt, years),
        data: map(parseFloat, data),
    }
}

// Transform API estimate data to chart data format
export function chartDataFromEstimate (estimate, selected, fn) {
    const series = `${selected} (estimated with ${fn} function)`
    const toChartData = (data, year) => {
        // TODO Is this necessary?
        const value = (
            isFinite(parseFloat(data))
                ? max(parseFloat(data), identity())
                : null
        )
        const row = fromPairs([
            ['Year', parseInt(year)],
            [series, value]
        ])
        return row
    }
    const zipped = zipObj(estimate['years'], estimate['data'])

    return {
        columns: fromPairs([[series, zipped]]),
        data: mapObjIndexed(toChartData, zipped),
        series: [series],
        covariance: estimate.covariance,
        estimate: series,
    }
}

export function concatOrMerge (a, b) {
    if (all(is(Array), [a, b])) {
        return concat(a, b)
    } else {
        return b || a
    }
}

export const mergeChartData = mergeDeepWith(concatOrMerge)
