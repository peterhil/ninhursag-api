import { derived } from 'svelte/store'
import { calculateReserves, hasReserves } from '../lib/reserves'
import { cumulative } from './cumulative'
import { reserve_data } from './reserve_data'
import { mineral } from './mineral'

export const reserves = derived(
    [
        cumulative,
        mineral,
        reserve_data,
    ],
    async ([
        $cumulative,
        $mineral,
        $reserve_data,
    ], set) => {
        const cumulative = await $cumulative
        const mineral = await $mineral
        const reserve_data = await $reserve_data
        const series = ['Reserves']

        if (hasReserves(reserve_data, mineral)) {
            const calculated = calculateReserves(cumulative, reserve_data, mineral, 'Cumulative', 'Reserves')
            console.debug('[Reserves] Estimated:', calculated)
            set({data: calculated, series})
        }
    },
    {data: {}, series: []}
)
