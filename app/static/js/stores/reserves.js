import { fromPairs, isEmpty } from 'ramda'
import { asyncable } from 'svelte-asyncable'
import { toDataSeries } from '../lib/data'
import { calculateReserves, getReserves } from '../lib/reserves'
import { cumulative } from './cumulative'
import { reserveData } from './reserveData'
import { mineral } from './mineral'

const initialValue = { columns: {} }

export const reserves = asyncable(
    async (
        $cumulative,
        $mineral,
        $reserveData,
    ) => {
        const cumulative = await $cumulative
        const mineral = await $mineral
        const reserveData = await $reserveData
        const series = 'Reserves'

        if (getReserves(reserveData, mineral)) {
            const calculated = calculateReserves(cumulative, reserveData, mineral, 'Cumulative', 'Reserves')
            // console.debug('[Reserves] Calculated:', calculated)

            return {
                columns: fromPairs([[series, calculated]]),
                reserves: reserveData,
            }
        } else {
            return {
                ...initialValue,
                reserves: reserveData,
            }
        }
    },
    initialValue,
    [
        cumulative,
        mineral,
        reserveData,
    ]
)
