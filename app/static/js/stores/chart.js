import { derived } from 'svelte/store'

import { mergeChartData } from '../lib/data'
import { cumulative } from './cumulative'
import { cumulativeFit } from './cumulativeFit'
import { data } from './data'
import { estimate } from './estimate'
import { interpolated } from './interpolated'
import { reserves } from './reserves'
import { reservesFit } from './reservesFit'

const initialValue = { data: {}, reserves: {}, columns: {} }

export const chart = derived(
    [
        data,
        cumulative,
        interpolated,
        reserves,
        estimate,
        cumulativeFit,
        reservesFit,
    ],
    async ([
        $data,
        $cumulative,
        $interpolated,
        $reserves,
        $estimate,
        $cumulativeFit,
        $reservesFit,
    ], set) => {
        const data = await $data
        const interpolated = await $interpolated
        const cumulative = await $cumulative
        const reserves = await $reserves

        const calculated = {
            ...data,
            columns: {
                ...data.columns,
                ...interpolated.columns,
                ...cumulative.columns,
                ...reserves.columns,
            }
        }
        // console.debug('[Chart] Calculated data:', calculated)
        set(calculated)

        const estimate = await $estimate
        const cumulativeFit = await $cumulativeFit
        const reservesFit = await $reservesFit

        const estimated = {
            ...calculated,
            columns: {
                ...calculated.columns,
                ...cumulativeFit.columns,
                ...reservesFit.columns,
                ...estimate.columns,
            }
        }
        // console.debug('[Chart] Estimated data:', estimated)
        set(estimated)
    },
    initialValue,
)
