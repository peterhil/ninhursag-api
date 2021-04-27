import axios from 'axios'
import { CancelToken } from 'axios'
import { values } from 'ramda'
import { asyncable } from 'svelte-asyncable'

import { errorHandler } from '../lib/api'
import { chartDataFromEstimate, dataForEstimate } from '../lib/estimate'
import { fn } from './function.js'
import { data } from './data.js'

let cancel

export const estimate = asyncable(async ($data, $fn) => {
    try {
        const data = await $data
        const fn = await $fn
        const params = {
            'function': fn,
            ...dataForEstimate(values(data.data), data.selected, 'Year')
        }
        // console.debug(`Estimating with ${fn}`, params)

        if (cancel) { cancel() }

        const res = await axios.post('/api/v1/estimate', params, {
            cancelToken: new CancelToken(function executor(c) {
                cancel = c
            }),
        })
        const estimated = chartDataFromEstimate(res.data, data.selected, fn)
        console.debug(`Estimated with ${fn}`, estimated)

        return estimated
    } catch (error) {
        if (axios.isCancel(error)) {
            console.log('Request canceled');
        } else {
            errorHandler(error)
            return error
        }
    }
}, undefined, [data, fn])
