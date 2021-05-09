import {
    fromPairs,
    lensPath,
    view,
} from 'ramda'
import { derived } from 'svelte/store'
import { accumulateDataSeries } from '../lib/cumulative'
import { toChartData } from '../lib/data'
import { data } from './data'

import { estimate } from './estimate'

const initialValue = { data: {}, columns: {} }

export const cumulativeFit = derived(
    [
        data,
        estimate,
    ],
    async ([
        $data,
        $estimate,
    ], set) => {
        const data = await $data
        const estimate = await $estimate
        const series = 'Cumulative fit'
        // console.debug('[Cumulative fit] Estimate and data:', estimate, data)

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
            data: toChartData(series, cumulativeSeries),
        })
    },
    initialValue,
)
