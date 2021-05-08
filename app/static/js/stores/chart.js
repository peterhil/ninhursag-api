import { derived } from 'svelte/store'

import { mergeChartData } from '../lib/data'
import { cumulative } from './cumulative'
import { cumulativeFit } from './cumulativeFit'
import { data } from './data'
import { estimate } from './estimate'
import { interpolated } from './interpolated'
import { reserves } from './reserves'
import { reservesFit } from './reservesFit'

export const chart = derived(
    [
        data,
        cumulative,
        interpolated,
        reserves,
        estimate,
        cumulativeFit,
        reservesFit,
    ],
    async ([
        $data,
        $cumulative,
        $interpolated,
        $reserves,
        $estimate,
        $cumulativeFit,
        $reservesFit,
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

        const cumulativeFit = await $cumulativeFit
        data = mergeChartData(data, cumulativeFit)
        // console.debug('[Chart] With cumulative fit:', cumulativeFit)
        set(data)

        const reservesFit = await $reservesFit
        data = mergeChartData(data, reservesFit)
        // console.debug('[Chart] With reserves fit:', reservesFit)
        set(data)

        data = mergeChartData(data, estimate)
        console.debug('[Chart] With estimate:', data)
        set(data)
    },
    { data: {}, series: [], reserves: {}, columns: {} }
)
