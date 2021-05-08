import { mapObjIndexed } from 'ramda'
import { accumulator, finite } from './data'

export function accumulateDataSeries (dataSeries) {
    const numbers = finite(dataSeries)
    const cumulative = mapObjIndexed(accumulator(), numbers)

    return cumulative
}
