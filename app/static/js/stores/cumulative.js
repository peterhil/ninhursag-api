import { derived } from 'svelte/store'
import { errorHandler } from '../lib/api'
import { accumulateData } from '../lib/cumulative'
import { data } from './data'
import { estimate } from './estimate'

export const cumulative = derived(
    [
        data,
    ],
    async ([
        $data,
    ], set) => {
        const data = await $data

        const series = ['Cumulative']
        const cumulative = accumulateData(data, data.selected, 'Cumulative', 100)
        console.debug('[Cumulative] Data:', cumulative)
        set({data: cumulative, series})
    },
    {data: {}, series: []}
)
