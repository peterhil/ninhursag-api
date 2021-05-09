import {
    fromPairs,
    isEmpty,
    head,
    last,
    max,
    mapObjIndexed,
    sortBy,
    toPairs,
} from 'ramda'

export function calculateReserves (cumulative, reserveData, mineral, column, series) {
    const reserves = getReserves(reserveData, mineral)

    if (!reserves) {
        // console.debug('No reserves!')
        return {}
    }

    const [reserveYear, reserveAmount] = last(sortBy(head, toPairs(reserves)))
    const cumulativeOnReserveYear = cumulative.data[reserveYear][column]

    return mapObjIndexed((row, year) => {
        return fromPairs([
            ['Year', year],
            [series, max(1, reserveAmount - (row[column] - cumulativeOnReserveYear))]
        ])
    }, cumulative.data)
}

export function getReserves (reserves, mineral) {
    return reserves.data && reserves.data[mineral]
}
