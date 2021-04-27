import { derived } from 'svelte/store'
import { calculateReserves, hasReserves } from '../lib/reserves'
import { cumulative_fit } from './cumulative_fit'
import { estimate } from './estimate'
import { reserve_data } from './reserve_data'
import { mineral } from './mineral'

export const reserves_fit = derived(
    [
        cumulative_fit,
        estimate,
        mineral,
        reserve_data,
    ],
    async ([
        $cumulative_fit,
        $estimate,
        $mineral,
        $reserve_data,
    ], set) => {
        const estimate = await $estimate
        const cumulative_fit = await $cumulative_fit
        const mineral = await $mineral
        const reserve_data = await $reserve_data
        const series = ['Reserves fit']

        if (hasReserves(reserve_data, mineral)) {
            // console.debug('[Reserves fit] Got estimate:', estimate, cumulative_fit)

            const calculated = calculateReserves(
                cumulative_fit,
                reserve_data,
                mineral,
                'Cumulative fit',
                'Reserves fit'
            )
            console.debug('[Reserves fit] Estimated fit:', calculated)
            set({data: calculated, series})
        }
    },
    {data: {}, series: []}
)
