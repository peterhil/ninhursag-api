import { curry, keys } from 'ramda'
import { asyncable } from 'svelte-asyncable'

import api from '../lib/api'
import { productionSeries, productionSeriesName } from '../lib/data'
import {
    chartDataFromEstimate,
    dataForEstimate,
    reportFitQuality,
} from '../lib/estimate'
import { alerts } from './alerts'
import { data } from './data'
import { fn } from './function'

export let controller

const initialValue = { columns: {} }

const success = curry((fn, estimate) => {
    const estimated = chartDataFromEstimate(
        estimate,
        productionSeriesName(keys(data.columns)),
        fn,
    )
    reportFitQuality(estimated, fn)
    // console.debug(`[Estimate] With ${fn}:`, estimated)

    return estimated
})

function failure (error) {
    if (error.name === 'AbortError') {
        console.info('Request canceled')
    } else {
        alerts.error(error.message)
    }

    return initialValue
}

export const estimate = asyncable(
    async ($data, $fn) => {
        const data = await $data
        const fn = await $fn

        const production = productionSeries(data.columns)
        const params = {
            function: fn,
            ...dataForEstimate(production)
        }
        // console.debug(`Estimating with ${fn}`, params)

        controller = new AbortController()
        const signal = controller.signal
        const estimated = await api.post(
            '/api/v1/estimate',
            {
                body: params,
                signal,
            },
            success(fn),
            failure,
        )
        controller = null

        return estimated
    },
    initialValue,
    [data, fn]
)
