import { asyncable } from 'svelte-asyncable'
import { data } from './data'
import { interpolateData } from '../lib/interpolate'
import { productionSeries } from '../lib/csv'

const initialValue = {data: {}, series: []}

export const interpolated = asyncable(
    async ($data) => {
        const data = await $data
        const series = ['Interpolated']

        const interpolated = interpolateData(data, data.selected)
        // console.debug('[Interpolated] Data:', interpolated)

        return {data: interpolated, series}
    },
    initialValue,
    [data]
)
