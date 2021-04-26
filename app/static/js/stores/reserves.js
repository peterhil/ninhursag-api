import { derived } from 'svelte/store'
import { errorHandler } from '../lib/api'
import { mergeChartData } from '../lib/estimate'
import { accumulateData } from '../lib/cumulative'
import { calculateReserves, hasReserves } from '../lib/reserves'
import { cumulative } from './cumulative'
import { estimate } from './estimate'
import { reserve_data } from './reserve_data'
import { mineral } from './mineral'

export const reserves = derived(
    [
        cumulative,
        estimate,
        mineral,
        reserve_data,
    ],
    async ([
        $cumulative,
        $estimate,
        $mineral,
        $reserve_data,
    ], set) => {
        const cumulative = await $cumulative
        const mineral = await $mineral
        const reserve_data = await $reserve_data
        const series = ['Reserves']

        // Reserves
        if (hasReserves(reserve_data, mineral)) {
            const calculated = calculateReserves(cumulative, reserve_data, mineral)
            console.debug('[Reserves] Estimated:', calculated)
            set({data: calculated, series})

            // Reserves fit
            const estimate = await $estimate
            const cumulative_estimate = await $cumulative
            console.debug('[Reserves] Got estimate:', estimate, cumulative_estimate)

            const calculated_estimate = calculateReserves(cumulative_estimate, reserve_data, mineral)
            console.debug('[Reserves] Estimated fit:', calculated_estimate)
            set({data: calculated_estimate, series})
        }
    },
    {data: {}, series: []}
)
