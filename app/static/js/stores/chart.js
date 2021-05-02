import { derived } from 'svelte/store'
import { identity, sortBy, uniq } from 'ramda'

import { errorHandler } from '../lib/api'
import { mergeChartData } from '../lib/estimate'
import { data } from './data'
import { estimate } from './estimate'
import { reserves } from './reserves'

export const chart = derived(
    [data, estimate, reserves],
    async ([$data, $estimate, $reserves], set) => {
        const data = await $data
        set(data)

        const reserves = await $reserves
        data.reserves = reserves
        set(data)

        const estimate = await $estimate
        const merged = mergeChartData(data, estimate)
        console.debug('Merged chart data:', merged)
        set(merged)
    },
    {data: {}, series: [], reserves: {}, columns: {}}
)
