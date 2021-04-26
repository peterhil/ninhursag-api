import {
    head,
    last,
    max,
    mapObjIndexed,
    sortBy,
    toPairs,
} from 'ramda'

export function calculateReserves(cumulative, reserves, mineral) {
    if (!(reserves.data && reserves.data[mineral])) {
        console.debug('No reserves!')
        return
    } else {
        const [reserveYear, reserveAmount] = last(sortBy(head, toPairs(reserves.data[mineral])))
        const cumulativeOnReserveYear = cumulative[reserveYear]['Cumulative']

        return mapObjIndexed((row, year) => {
            return {
                Year: year,
                Cumulative: row['Cumulative'],
                Reserves: max(1, reserveAmount - (row['Cumulative'] - cumulativeOnReserveYear))
            }
        }, cumulative)
    }
}
