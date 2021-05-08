import { fromPairs } from 'ramda'
import { asyncable } from 'svelte-asyncable'
import { accumulateData } from '../lib/cumulative'
import { toDataSeries } from '../lib/data'
import { data } from './data'
import { interpolated } from './interpolated'

const initialValue = { data: {}, series: [] }

export const cumulative = asyncable(
    async ($data, $interpolated) => {
        const data = await $data
        const interpolated = await $interpolated

        const series = 'Cumulative'
        const cumulative = accumulateData(
            interpolated,
            data.selected,
            series,
            100
        )
        const dataSeries = toDataSeries(series, cumulative)
        // console.debug('[Cumulative] Data:', data.selected, cumulative, dataSeries)

        return {
            columns: fromPairs([[series, dataSeries]]),
            data: cumulative,
            series: [series],
        }
    },
    initialValue,
    [data, interpolated]
)
