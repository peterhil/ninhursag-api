import {
    filter,
    fromPairs,
    defaultTo,
    head,
    indexBy,
    is,
    keys,
    last,
    map,
    prop,
    range,
} from 'ramda'

export function accumulateData (data, column, series, extraYears = 0) {
    let currentYear
    let total = 0

    // Check if request was canceled and thus column is undefined
    if (!column) {
        console.assert(column, 'Empty column for:', series, data)
        return data
    }

    const dataYears = filter((row) => is(Number, row[column]), data.data)
    const first = parseInt(head(keys(dataYears)))
    const latest = parseInt(last(keys(dataYears)))
    const years = range(first, latest + extraYears)

    // console.debug('[AccumulateData] Range:', first, latest, column)

    // TODO Write separate function that uses world production data until the estimation continues!
    return indexBy(prop('Year'), map((year) => {
        if (year <= latest) {
            currentYear = defaultTo(0, parseFloat(data.data[year][column]))
        } else {
            currentYear = latest
        }
        total += currentYear

        return fromPairs([
            ['Year', year],
            [series, total],
        ])
    }, years))
}
