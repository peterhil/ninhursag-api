import { derived } from 'svelte/store'
import { errorHandler } from '../lib/api'
import { accumulateData } from '../lib/cumulative'
import { data } from './data'
import { estimate } from './estimate'

export const cumulative = derived(
    [
        data,
        estimate,
    ],
    async ([
        $data,
        $estimate,
    ], set) => {
        const data = await $data
        const series = ['Cumulative']

        // Cumulative
        const cumulative = accumulateData(data, data.selected, 100)
        console.debug('[Cumulative] Data:', cumulative)
        set({data: cumulative, series})

        // Cumulative fit
        const estimate = await $estimate
        console.debug('Got estimate and data:', estimate, data)
        const cumulative_estimate = accumulateData(estimate, estimate.estimate, 0)
        console.debug('[Cumulative] Fit:', cumulative_estimate)
        set({data: cumulative_estimate, series})
    },
    {data: {}, series: []}
)
