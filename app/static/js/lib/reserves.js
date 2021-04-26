import {
    isEmpty,
    head,
    last,
    max,
    mapObjIndexed,
    sortBy,
    toPairs,
} from 'ramda'

export function calculateReserves (cumulative, reserves, mineral) {
    if (isEmpty(cumulative.data)) {
        console.debug('No cumulative data yet')
        return
    }
    if (!(reserves.data && reserves.data[mineral])) {
        console.debug('No reserves!')
        return
    } else {
        const [reserveYear, reserveAmount] = last(sortBy(head, toPairs(reserves.data[mineral])))
        const cumulativeOnReserveYear = cumulative.data[reserveYear]['Cumulative']

        return mapObjIndexed((row, year) => {
            return {
                Year: year,
                Reserves: max(1, reserveAmount - (row['Cumulative'] - cumulativeOnReserveYear))
            }
        }, cumulative.data)
    }
}

export function hasReserves (reserves, mineral) {
    return reserves.data && reserves.data[mineral]
}
