import { derived } from 'svelte/store'

import { mergeChartData } from '../lib/data'
import { cumulative } from './cumulative'
import { cumulative_fit } from './cumulative_fit'
import { data } from './data'
import { estimate } from './estimate'
import { interpolated } from './interpolated'
import { reserves } from './reserves'
import { reserves_fit } from './reserves_fit'

export const chart = derived(
    [
        data,
        cumulative,
        interpolated,
        reserves,
        estimate,
        cumulative_fit,
        reserves_fit,
    ],
    async ([
        $data,
        $cumulative,
        $interpolated,
        $reserves,
        $estimate,
        $cumulative_fit,
        $reserves_fit,
    ], set) => {
        let data = await $data
        const interpolated = await $interpolated
        const cumulative = await $cumulative
        const reserves = await $reserves

        data = mergeChartData(data, interpolated)
        // console.debug('[Chart] With interpolated:', interpolated)

        data = mergeChartData(data, cumulative)
        // console.debug('[Chart] With cumulative:', cumulative)

        data = mergeChartData(data, reserves)
        console.debug('[Chart] With reserves:', data)

        set(data)

        const estimate = await $estimate

        const cumulative_fit = await $cumulative_fit
        data = mergeChartData(data, cumulative_fit)
        // console.debug('[Chart] With cumulative fit:', cumulative_fit)
        set(data)

        const reserves_fit = await $reserves_fit
        data = mergeChartData(data, reserves_fit)
        // console.debug('[Chart] With reserves fit:', reserves_fit)
        set(data)

        data = mergeChartData(data, estimate)
        console.debug('[Chart] With estimate:', data)
        set(data)
    },
    { data: {}, series: [], reserves: {}, columns: {} }
)
