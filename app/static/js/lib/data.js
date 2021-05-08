import {
    all,
    concat,
    filter,
    fromPairs,
    is,
    last,
    map,
    mapObjIndexed,
    mergeDeepWith,
    props,
    times,
    toPairs,
    values,
    zipObj,
} from 'ramda'

export const finite = filter(Number.isFinite)

// Get counter function that accumulates total on successive calls
export function accumulator (start = 0) {
    let total = start
    const counter = (value) => {
        total += value
        return total
    }
    return counter
}

export function concatOrMerge (a, b) {
    if (all(is(Array), [a, b])) {
        return concat(a, b)
    } else {
        return b || a
    }
}

export function repeatLastValue (dataSeries, futureYears = 100) {
    const numbers = finite(dataSeries)
    const [lastYear, lastValue] = last(toPairs(numbers))
    const future = (fromYear, value, years) => {
        return zipObj(
            times((n) => parseInt(fromYear) + n + 1, years),
            times(() => value, years)
        )
    }

    return future(lastYear, lastValue, futureYears)
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
            [series, parseFloat(value)], // TODO Maybe check with isFinite?
        ])
    }

    return mapObjIndexed(indexer, data)
}
