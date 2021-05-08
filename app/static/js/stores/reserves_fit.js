import { fromPairs } from 'ramda'
import { derived } from 'svelte/store'
import { toDataSeries } from '../lib/data'
import { calculateReserves, hasReserves } from '../lib/reserves'
import { cumulative_fit } from './cumulative_fit'
import { reserve_data } from './reserve_data'
import { mineral } from './mineral'

export const reserves_fit = derived(
    [
        cumulative_fit,
        mineral,
        reserve_data,
    ],
    async ([
        $cumulative_fit,
        $mineral,
        $reserve_data,
    ], set) => {
        const cumulative_fit = await $cumulative_fit
        const mineral = await $mineral
        const reserve_data = await $reserve_data
        const series = 'Reserves fit'

        if (hasReserves(reserve_data, mineral)) {
            // console.debug('[Reserves fit] Got cumulative fit:', cumulative_fit)

            const calculated = calculateReserves(
                cumulative_fit,
                reserve_data,
                mineral,
                'Cumulative fit',
                series,
            )
            const dataSeries = toDataSeries(series, calculated)
            console.debug('[Reserves fit] Estimated fit:', calculated, dataSeries)

            set({
                columns: fromPairs([[series, dataSeries]]),
                data: calculated,
                series: [series],
            })
        }
    },
    {data: {}, series: [], columns: {}}
)
