import { fromPairs } from 'ramda'
import { asyncable } from 'svelte-asyncable'

import { calculateReserves, getReserves } from '../lib/reserves'

import { cumulativeFit } from './cumulativeFit'
import { mineral } from './mineral'
import { reserveData } from './reserveData'

const initialValue = { columns: {} }

export const reservesFit = asyncable(
    async (
        $cumulativeFit,
        $mineral,
        $reserveData,
    ) => {
        const cumulativeFit = await $cumulativeFit
        const mineral = await $mineral
        const reserveData = await $reserveData

        const series = 'Reserves fit'
        const cumulativeSeries = cumulativeFit.columns['Cumulative fit']

        if (!cumulativeSeries) {
            // console.debug('No cumulative data yet')
            return initialValue
        }

        if (getReserves(reserveData, mineral)) {
            // console.debug('[Reserves fit] Got cumulative fit:', cumulativeFit)

            const calculated = calculateReserves(
                cumulativeFit,
                reserveData,
                mineral,
                'Cumulative fit',
            )
            // console.debug('[Reserves fit] Calculated:', calculated)

            return {
                columns: fromPairs([[series, calculated]]),
            }
        }

        return initialValue
    },
    initialValue,
    [
        cumulativeFit,
        mineral,
        reserveData,
    ],
)
