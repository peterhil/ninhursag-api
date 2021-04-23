import { isFinite } from 'lodash'
import {
    all,
    concat,
    fromPairs,
    identity,
    is,
    map,
    mapObjIndexed,
    mergeDeepWith,
    max,
    zipObj,
} from 'ramda'

// Transform chart data format into object with arrays for years and data
export function dataForEstimate (data, selected, index = 'Year') {
    // TODO Change request data structure?
    let result = {
        data: [],
        years: [],
    }

    map(row => {
        const idx = parseInt(row[index])
        const val = parseFloat(row[selected])

        if (val && idx) {
            result.years.push(idx)
            result.data.push(val)
        }
    }, data)

    return result
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
        data: mapObjIndexed(toChartData, zipped),
        series: [series],
        covariance: estimate.covariance
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
