import { fromPairs, isEmpty } from 'ramda'
import { asyncable } from 'svelte-asyncable'
import { toDataSeries } from '../lib/data'
import { calculateReserves, getReserves } from '../lib/reserves'
import { cumulative } from './cumulative'
import { reserveData } from './reserveData'
import { mineral } from './mineral'

const initialValue = { data: {}, series: [], reserves: {} }

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

        if (isEmpty(cumulative.data)) {
            // console.debug('No cumulative data yet')
            return initialValue
        }

        if (getReserves(reserveData, mineral)) {
            const calculated = calculateReserves(cumulative, reserveData, mineral, 'Cumulative', 'Reserves')
            const dataSeries = toDataSeries(series, calculated)
            // console.debug('[Reserves] Estimated:', calculated, dataSeries)

            return {
                columns: fromPairs([[series, dataSeries]]),
                data: calculated,
                series: [series],
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
