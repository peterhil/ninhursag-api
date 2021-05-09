import { fromPairs, isEmpty } from 'ramda'
import { derived } from 'svelte/store'
import { toDataSeries } from '../lib/data'
import { calculateReserves, getReserves } from '../lib/reserves'
import { cumulativeFit } from './cumulativeFit'
import { estimate } from './estimate'
import { reserveData } from './reserveData'
import { mineral } from './mineral'

const initialValue = { columns: {} }

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
        const cumulativeSeries = cumulativeFit.columns['Cumulative fit']

        if (!cumulativeSeries) {
            // console.debug('No cumulative data yet')
            return
        }

        if (getReserves(reserveData, mineral)) {
            // console.debug('[Reserves fit] Got estimate:', estimate, cumulativeFit)

            const calculated = calculateReserves(
                cumulativeFit,
                reserveData,
                mineral,
                'Cumulative fit',
                series,
            )
            // console.debug('[Reserves fit] Estimated fit:', calculated)

            set({
                columns: fromPairs([[series, calculated]]),
            })
        } else {
            set(initialValue)
        }
    },
    initialValue,
)
