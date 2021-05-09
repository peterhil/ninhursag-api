import {
    filter,
    fromPairs,
    is,
    map,
    toPairs,
    transpose,
    zipObj,
} from 'ramda'
import { toChartData } from './data'

// Transform chart data format into object with arrays for years and data
export function dataForEstimate (series) {
    const numbers = filter(is(Number), series) // TODO Maybe use isFinite?
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
    const zipped = zipObj(estimate.years, estimate.data)

    return {
        columns: fromPairs([[series, zipped]]),
        data: toChartData(series, zipped),
        covariance: estimate.covariance,
        estimate: series,
    }
}
