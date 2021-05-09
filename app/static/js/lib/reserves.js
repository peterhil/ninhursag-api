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

export function calculateReserves (cumulative, reserves, mineral, column, series) {
    if (isEmpty(cumulative.data)) {
        // console.debug('No cumulative data yet')
        return {}
    }
    if (!(hasReserves(reserves, mineral))) {
        // console.debug('No reserves!')
        return {}
    } else {
        const [reserveYear, reserveAmount] = last(sortBy(head, toPairs(reserves.data[mineral])))
        const cumulativeOnReserveYear = cumulative.data[reserveYear][column]

        return mapObjIndexed((row, year) => {
            return fromPairs([
                ['Year', year],
                [series, max(1, reserveAmount - (row[column] - cumulativeOnReserveYear))]
            ])
        }, cumulative.data)
    }
}

export function hasReserves (reserves, mineral) {
    return reserves.data && reserves.data[mineral]
}
