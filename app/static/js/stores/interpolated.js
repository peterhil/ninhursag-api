import { fromPairs } from 'ramda'
import { asyncable } from 'svelte-asyncable'
import { data } from './data'
import { toDataSeries } from '../lib/data'
import { interpolateData } from '../lib/interpolate'

const initialValue = { data: {}, series: [] }

export const interpolated = asyncable(
    async ($data) => {
        const data = await $data
        const series = 'World production (interpolated)'

        if (!data.selected) {
            return initialValue
        }

        const interpolated = interpolateData(data, data.selected)
        const dataSeries = toDataSeries(data.selected, interpolated)
        console.debug('[Interpolated] Data:', interpolated, dataSeries)

        return {
            columns: fromPairs([[series, dataSeries]]),
            data: interpolated,
            series: [series]
        }
    },
    initialValue,
    [data]
)
