import { fromPairs } from 'ramda'
import { derived } from 'svelte/store'
import { toDataSeries } from '../lib/data'
import { calculateReserves, hasReserves } from '../lib/reserves'
import { cumulativeFit } from './cumulativeFit'
import { estimate } from './estimate'
import { reserveData } from './reserveData'
import { mineral } from './mineral'

export const reservesFit = derived(
    [
        cumulativeFit,
        estimate,
        mineral,
        reserveData,
    ],
    async ([
        $cumulativeFit,
        $estimate,
        $mineral,
        $reserveData,
    ], set) => {
        const estimate = await $estimate
        const cumulativeFit = await $cumulativeFit
        const mineral = await $mineral
        const reserveData = await $reserveData
        const series = 'Reserves fit'

        if (hasReserves(reserveData, mineral)) {
            // console.debug('[Reserves fit] Got estimate:', estimate, cumulativeFit)

            const calculated = calculateReserves(
                cumulativeFit,
                reserveData,
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
    { data: {}, series: [], columns: {} }
)
