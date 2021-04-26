import {
    fromPairs,
    defaultTo,
    head,
    indexBy,
    keys,
    last,
    map,
    prop,
    range,
} from 'ramda'

export function accumulateData (data, column, series, extraYears = 0) {
    let currentYear
    let total = 0

    const dataYears = keys(data.data)
    const first = parseInt(head(dataYears))
    const latest = parseInt(last(dataYears))
    const years = range(first, latest + extraYears)
    const latestData = data.data[latest][column]

    console.debug('Range:', first, latest, latestData, column, total, data)

    // TODO Write separate function that uses world production data until the estimation continues!
    return indexBy(prop('Year'), map((year) => {
        if (year <= latest) {
            currentYear = defaultTo(0, parseFloat(data.data[year][column]))
        } else {
            currentYear = latestData
        }
        total += currentYear

        return fromPairs([
            ['Year', year],
            [series, total],
        ])
    }, years))
}
