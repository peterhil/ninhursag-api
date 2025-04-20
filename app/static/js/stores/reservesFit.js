import { fromPairs } from 'ramda'
import { derived } from 'svelte/store'

import { calculateReserves, getReserves } from '../lib/reserves'
import { cumulativeFit } from './cumulativeFit'
import { reserveData } from './reserveData'
import { mineral } from './mineral'

const initialValue = { columns: {} }

export const reservesFit = derived(
    [
        cumulativeFit,
        mineral,
        reserveData,
    ],
    async ([
        $cumulativeFit,
        $mineral,
        $reserveData,
    ], set) => {
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
            // console.debug('[Reserves fit] Got cumulative fit:', cumulativeFit)

            const calculated = calculateReserves(
                cumulativeFit,
                reserveData,
                mineral,
                'Cumulative fit',
                series,
            )
            // console.debug('[Reserves fit] Calculated:', calculated)

            set({
                columns: fromPairs([[series, calculated]]),
            })
        }
        else {
            set(initialValue)
        }
    },
    initialValue,
)
