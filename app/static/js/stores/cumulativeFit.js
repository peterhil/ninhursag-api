import { fromPairs } from 'ramda'
import { derived } from 'svelte/store'
import { accumulateData } from '../lib/cumulative'
import { toDataSeries } from '../lib/data'
import { data } from './data'
import { estimate } from './estimate'

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

        const cumulative = accumulateData(
            estimate,
            estimate.estimate,
            series,
            0,
        )
        const dataSeries = toDataSeries(series, cumulative)
        console.debug('[Cumulative fit] Cumulative data:', cumulative, dataSeries)

        set({
            columns: fromPairs([[series, dataSeries]]),
            data: cumulative,
            series: [series],
        })
    },
    { data: {}, series: [], columns: {} }
)
