import axios, { CancelToken } from 'axios'
import { keys } from 'ramda'
import { asyncable } from 'svelte-asyncable'

import { errorHandler } from '../lib/api'
import { productionSeries, productionSeriesName } from '../lib/data'
import {
    chartDataFromEstimate,
    dataForEstimate,
    reportFitQuality,
} from '../lib/estimate'
import { fn } from './function.js'
import { data } from './data.js'

let cancel

const initialValue = { columns: {} }

export const estimate = asyncable(async ($data, $fn) => {
    try {
        if (cancel) { cancel() }

        const data = await $data
        const fn = await $fn

        const production = productionSeries(data.columns)
        const params = {
            function: fn,
            ...dataForEstimate(production)
        }
        // console.debug(`Estimating with ${fn}`, params)

        const res = await axios.post('/api/v1/estimate', params, {
            cancelToken: new CancelToken(function executor (c) {
                cancel = c
            }),
        })
        const estimated = chartDataFromEstimate(
            res.data,
            productionSeriesName(keys(data.columns)),
            fn,
        )
        reportFitQuality(estimated, fn)
        // console.debug(`[Estimate] With ${fn}:`, estimated)

        return estimated
    } catch (error) {
        if (axios.isCancel(error)) {
            console.log('Request canceled')

            return initialValue
        } else {
            errorHandler(error)

            return error
        }
    }
}, initialValue, [data, fn])
