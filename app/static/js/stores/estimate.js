import axios from 'axios'
import { values } from 'ramda'
import { asyncable } from 'svelte-asyncable'

import { errorHandler } from '../lib/api'
import { chartDataFromEstimate, dataForEstimate } from '../lib/estimate'
import { fn } from './function.js'
import { data } from './data.js'

export const estimate = asyncable(async ($data, $fn) => {
    try {
        const data = await $data
        const fn = await $fn
        const params = {
            'function': fn,
            ...dataForEstimate(values(data.data), data.selected, 'Year')
        }
        // console.debug(`Estimating with ${fn}`, data, params)

        const res = await axios.post('/api/v1/estimate', params)
        const estimated = chartDataFromEstimate(res.data, data.selected, fn)
        // console.debug(`Estimated with ${fn}`, estimated)

        return estimated
    } catch (error) {
        errorHandler(error)
        return error
    }
}, undefined, [data, fn])
