import { asyncable } from 'svelte-asyncable'
import { identity, sortBy, uniq } from 'ramda'

import { errorHandler } from '../lib/api'
import { mergeChartData } from '../lib/estimate'
import { data } from './data.js'
import { estimate } from './estimate.js'

export const chart = asyncable(async ($data, $estimate) => {
    try {
        const data = await $data
        const estimate = await $estimate
        const merged = mergeChartData(data, estimate)

        merged.series = uniq(sortBy(identity, merged.series))
        console.debug(`Merged chart data: `, merged)

        return merged
    } catch (error) {
        errorHandler(error)
        return error
    }
}, undefined, [data, estimate])
