import { derived } from 'svelte/store'
import { errorHandler } from '../lib/api'
import { mergeChartData } from '../lib/estimate'
import { accumulateData } from '../lib/cumulative'
import { calculateReserves, hasReserves } from '../lib/reserves'
import { cumulative } from './cumulative'
import { estimate } from './estimate'
import { reserves } from './reserves'
import { mineral } from './mineral'

export const reserve_estimate = derived(
    [
        cumulative,
        estimate,
        mineral,
        reserves
    ],
    async ([
        $cumulative,
        $estimate,
        $mineral,
        $reserves
    ], set) => {
        const cumulative = await $cumulative
        const mineral = await $mineral
        const reserves = await $reserves
        const series = ['Reserves']

        // Reserves
        if (hasReserves(reserves, mineral)) {
            const calculated = calculateReserves(cumulative, reserves, mineral)
            console.debug('[Reserves] Estimated:', calculated)
            set({data: calculated, series})

            // Reserves fit
            const estimate = await $estimate
            const cumulative_estimate = await $cumulative
            console.debug('[Reserves] Got estimate:', estimate, cumulative_estimate)

            const calculated_estimate = calculateReserves(cumulative_estimate, reserves, mineral)
            console.debug('[Reserves] Estimated fit:', calculated_estimate)
            set({data: calculated_estimate, series})
        }
    },
    {data: {}, series: []}
)
