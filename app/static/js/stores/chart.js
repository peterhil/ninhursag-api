import { derived } from 'svelte/store'
import { identity, sortBy, uniq } from 'ramda'

import { errorHandler } from '../lib/api'
import { mergeChartData } from '../lib/estimate'
import { cumulative } from './cumulative'
import { data } from './data'
import { estimate } from './estimate'
import { reserves } from './reserves'
import { reserve_estimate } from './reserve_estimate'

export const chart = derived(
    [
        data,
        cumulative,
        estimate,
        reserves,
        reserve_estimate
    ],
    async ([
        $data,
        $cumulative,
        $estimate,
        $reserves,
        $reserve_estimate
    ], set) => {
        const data = await $data
        set(data)

        const reserves = await $reserves
        data.reserves = reserves
        set(data)

        const cumulative = await $cumulative
        const with_cumulative = mergeChartData(data, cumulative)
        console.debug('[Chart] With cumulative:', with_cumulative)
        set(with_cumulative)

        const reserve_estimate = await $reserve_estimate
        const with_reserves = mergeChartData(with_cumulative, reserve_estimate)
        console.debug('[Chart] With reserves:', with_reserves)
        set(with_reserves)

        const estimate = await $estimate
        const merged = mergeChartData(with_reserves, estimate)
        console.debug('[Chart] With estimate:', merged)
        set(merged)
    },
    {data: {}, series: [], reserves: {}}
)
