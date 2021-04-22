import { derived } from 'svelte/store'
import { identity, sortBy, uniq } from 'ramda'

import { errorHandler } from '../lib/api'
import { mergeChartData } from '../lib/estimate'
import { data } from './data.js'
import { estimate } from './estimate.js'

export const chart = derived(
    [data, estimate],
    async ([$data, $estimate], set) => {
        const data = await $data
        set(data)

        const estimate = await $estimate
        const merged = mergeChartData(data, estimate)
        console.debug(`Merged chart data: `, merged)
        set(merged)
    },
    {data: {}, series: []}
)
