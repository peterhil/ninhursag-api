import { asyncable } from 'svelte-asyncable'
import { calculateReserves, hasReserves } from '../lib/reserves'
import { cumulative } from './cumulative'
import { reserve_data } from './reserve_data'
import { mineral } from './mineral'

const initialValue = {data: {}, series: [], reserves: {}}

export const reserves = asyncable(
    async (
        $cumulative,
        $mineral,
        $reserve_data,
    ) => {
        const cumulative = await $cumulative
        const mineral = await $mineral
        const reserve_data = await $reserve_data
        const series = ['Reserves']

        if (hasReserves(reserve_data, mineral)) {
            const calculated = calculateReserves(cumulative, reserve_data, mineral, 'Cumulative', 'Reserves')
            // console.debug('[Reserves] Estimated:', calculated)
            return {data: calculated, series, reserves: reserve_data}
        } else {
            return {...initialValue, reserves: reserve_data}
        }
    },
    initialValue,
    [
        cumulative,
        mineral,
        reserve_data,
    ]
)
