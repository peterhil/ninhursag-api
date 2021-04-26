import { derived } from 'svelte/store'
import { identity, sortBy, uniq } from 'ramda'

import { errorHandler } from '../lib/api'
import { mergeChartData } from '../lib/estimate'
import { data } from './data'
import { estimate } from './estimate'
import { reserves } from './reserves'
import { reserve_estimate } from './reserve_estimate'

export const chart = derived(
    [
        data,
        estimate,
        reserves,
        reserve_estimate
    ],
    async ([
        $data,
        $estimate,
        $reserves,
        $reserve_estimate
    ], set) => {
        const data = await $data
        set(data)

        const reserves = await $reserves
        data.reserves = reserves
        set(data)

        const reserve_estimate = await $reserve_estimate
        const with_reserves = mergeChartData(data, reserve_estimate)
        console.debug('Chart data with reserves:', with_reserves)
        set(with_reserves)

        const estimate = await $estimate
        const merged = mergeChartData(with_reserves, estimate)
        console.debug('Merged chart data:', merged)
        set(merged)
    },
    {data: {}, series: [], reserves: {}}
)
