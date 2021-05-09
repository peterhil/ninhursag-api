import { fromPairs } from 'ramda'
import { asyncable } from 'svelte-asyncable'
import { data } from './data'
import { toChartData } from '../lib/data'
import { interpolateData } from '../lib/interpolate'

const initialValue = { data: {}, series: [] }

export const interpolated = asyncable(
    async ($data) => {
        const data = await $data
        const series = 'World production (interpolated)'

        if (!data.selected) {
            return initialValue
        }
        const production = data.columns[data.selected]
        const interpolated = interpolateData(production)
        // console.debug('[Interpolated] Data:', interpolated)

        return {
            columns: fromPairs([[series, interpolated]]),
            data: toChartData(series, interpolated),
            series: [series]
        }
    },
    initialValue,
    [data]
)
