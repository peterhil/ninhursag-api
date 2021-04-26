import { derived } from 'svelte/store'
import { errorHandler } from '../lib/api'
import { mergeChartData } from '../lib/estimate'
import { accumulateData } from '../lib/cumulative'
import { calculateReserves } from '../lib/reserves'
import { data } from './data'
import { estimate } from './estimate'
import { reserves } from './reserves'
import { mineral } from './mineral'

function hasReserves (reserves, mineral) {
    return reserves.data && reserves.data[mineral]
}

export const reserve_estimate = derived(
    [
        data,
        estimate,
        mineral,
        reserves
    ],
    async ([
        $data,
        $estimate,
        $mineral,
        $reserves
    ], set) => {
        let series = ['Cumulative']
        const data = await $data

        // Cumulative
        const cumulative = accumulateData(data, data.selected, 100)
        console.debug('Cumulative:', cumulative)
        set({data: cumulative, series})

        // Reserves
        const mineral = await $mineral
        const reserves = await $reserves
        if (hasReserves(reserves, mineral)) {
            const calculated = calculateReserves(cumulative, reserves, mineral)
            console.debug('Estimated reserves:', calculated)
            series.push('Reserves')
            set({data: calculated, series})
        }

        // Cumulative fit
        const estimate = await $estimate
        console.debug('Got estimate and data:', estimate)
        const cumulative_estimate = accumulateData(estimate, estimate.estimate, 0)
        console.debug('Cumulative fit:', cumulative_estimate)
        series = ['Cumulative']
        set({data: cumulative, series})

        // Reserves fit
        if (hasReserves(reserves, mineral)) {
            const calculated_estimate = calculateReserves(cumulative_estimate, reserves, mineral)
            console.debug('Estimated reserves fit:', calculated_estimate)
            set({data: calculated_estimate, series: ['Cumulative', 'Reserves']})
        }
    },
    {data: {}, series: []}
)
