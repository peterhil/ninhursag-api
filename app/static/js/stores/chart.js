import { derived } from 'svelte/store'
import { identity, sortBy, uniq } from 'ramda'

import { errorHandler } from '../lib/api'
import { mergeChartData } from '../lib/estimate'
import { cumulative } from './cumulative'
import { cumulative_fit } from './cumulative_fit'
import { data } from './data'
import { estimate } from './estimate'
import { reserve_data } from './reserve_data'
import { reserves } from './reserves'

export const chart = derived(
    [
        data,
        cumulative,
        cumulative_fit,
        estimate,
        reserve_data,
        reserves
    ],
    async ([
        $data,
        $cumulative,
        $cumulative_fit,
        $estimate,
        $reserve_data,
        $reserves
    ], set) => {
        let data = await $data
        set(data)

        const reserve_data = await $reserve_data
        data.reserves = reserve_data
        set(data)

        const cumulative = await $cumulative
        data = mergeChartData(data, cumulative)
        console.debug('[Chart] With cumulative:', data)
        set(data)

        const reserves = await $reserves
        data = mergeChartData(data, reserves)
        console.debug('[Chart] With reserves:', data)
        set(data)

        const estimate = await $estimate

        const cumulative_fit = await $cumulative_fit
        data = mergeChartData(data, cumulative_fit)
        console.debug('[Chart] With cumulative fit:', data)
        set(data)

        data = mergeChartData(data, estimate)
        console.debug('[Chart] With estimate:', data)
        set(data)
    },
    {data: {}, series: [], reserves: {}}
)
