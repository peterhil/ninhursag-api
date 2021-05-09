import { fromPairs } from 'ramda'
import { asyncable } from 'svelte-asyncable'
import { data } from './data'
import {
    productionSeries,
    productionSeriesName,
    toChartData
} from '../lib/data'
import { interpolateData } from '../lib/interpolate'

const initialValue = { columns: {}, data: {} }

export const interpolated = asyncable(
    async ($data) => {
        const data = await $data

        const series = 'World production (interpolated)'
        const production = productionSeries(data.columns)
        const interpolated = interpolateData(production)
        // console.debug('[Interpolated] Data:', interpolated)

        return {
            columns: fromPairs([[series, interpolated]]),
            data: toChartData(series, interpolated),
         }
    },
    initialValue,
    [data]
)
