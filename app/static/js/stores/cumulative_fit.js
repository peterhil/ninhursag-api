import { fromPairs } from 'ramda'
import { derived } from 'svelte/store'
import { accumulateData } from '../lib/cumulative'
import { toDataSeries } from '../lib/data'
import { estimate } from './estimate'

export const cumulative_fit = derived(
    [
        estimate,
    ],
    async ([
        $estimate,
    ], set) => {
        const estimate = await $estimate
        const series = 'Cumulative fit'
        // console.debug('[Cumulative fit] Estimate:', estimate)

        if (!estimate) { return }

        const cumulative_estimate = accumulateData(
            estimate,
            estimate.estimate,
            series,
            0,
        )
        const dataSeries = toDataSeries(series, cumulative_estimate)
        console.debug('[Cumulative fit] Cumulative data:', cumulative_estimate, dataSeries)

        set({
            columns: fromPairs([[series, dataSeries]]),
            data: cumulative_estimate,
            series: [series],
        })
    },
    {data: {}, series: [], columns: {}}
)
