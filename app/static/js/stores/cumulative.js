import { asyncable } from 'svelte-asyncable'
import { accumulateData } from '../lib/cumulative'
import { data } from './data'

const initialValue = {data: {}, series: []}

export const cumulative = asyncable(
    async ($data) => {
        const data = await $data

        const series = ['Cumulative']
        const cumulative = accumulateData(data, data.selected, 'Cumulative', 100)
        console.debug('[Cumulative] Data:', data.selected, cumulative)
        return {data: cumulative, series}
    },
    initialValue,
    [data]
)
