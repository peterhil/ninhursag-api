import {
    fromPairs,
    lensPath,
    view,
} from 'ramda'
import { derived } from 'svelte/store'

import { accumulateDataSeries } from '../lib/cumulative'
import { estimate } from './estimate'

const initialValue = { columns: {} }

export const cumulativeFit = derived(
    [
        estimate,
    ],
    async ([
        $estimate,
    ], set) => {
        const estimate = await $estimate
        const series = 'Cumulative fit'
        // console.debug('[Cumulative fit] Estimate:', estimate)

        if (!estimate.data) { return }

        // TODO Change all column data handling to use {year: value}
        // format, starting with interpolated!
        const productionSeries = view(lensPath([
            'columns',
            estimate.estimate,
        ]), estimate)
        const cumulativeSeries = accumulateDataSeries(productionSeries)
        // console.debug('[Cumulative fit] Cumulative data:', cumulativeSeries)

        set({
            columns: fromPairs([[series, cumulativeSeries]]),
        })
    },
    initialValue,
)
