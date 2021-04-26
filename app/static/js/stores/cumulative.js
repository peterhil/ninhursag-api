import { asyncable } from 'svelte-asyncable'
import { accumulateData } from '../lib/cumulative'
import { data } from './data'
import { interpolated } from './interpolated'

const initialValue = {data: {}, series: []}

export const cumulative = asyncable(
    async ($data, $interpolated) => {
        const data = await $data
        const interpolated = await $interpolated

        const series = ['Cumulative']
        const cumulative = accumulateData(interpolated, data.selected, 'Cumulative', 100)
        console.debug('[Cumulative] Data:', data.selected, cumulative)
        return {data: cumulative, series}
    },
    initialValue,
    [data, interpolated]
)
