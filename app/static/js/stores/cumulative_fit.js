import { derived } from 'svelte/store'
import { accumulateData } from '../lib/cumulative'
import { data } from './data'
import { estimate } from './estimate'

export const cumulative_fit = derived(
    [
        data,
        estimate,
    ],
    async ([
        $data,
        $estimate,
    ], set) => {
        const data = await $data
        const estimate = await $estimate
        const series = ['Cumulative fit']

        console.debug('[Cumulative fit] Estimate and data:', estimate, data)
        const cumulative_estimate = accumulateData(estimate, estimate.estimate, 'Cumulative fit', 0)
        console.debug('[Cumulative fit] Cumulative data:', cumulative_estimate)
        set({data: cumulative_estimate, series})
    },
    {data: {}, series: []}
)
