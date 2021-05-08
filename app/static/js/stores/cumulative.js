import {
    fromPairs,
    lensPath,
    view,
} from 'ramda'
import { asyncable } from 'svelte-asyncable'
import { accumulateDataSeries } from '../lib/cumulative'
import { repeatLastValue, toChartData } from '../lib/data'
import { data } from './data'
import { interpolated } from './interpolated'

const initialValue = { data: {}, series: [] }

export const cumulative = asyncable(
    async ($data, $interpolated) => {
        const data = await $data
        const interpolated = await $interpolated
        const series = 'Cumulative'
        // console.debug('[Cumulative] Data and interpolated:', data, interpolated)

        if (!data.selected) {
            return initialValue
        }

        // TODO Change all column data handling to use {year: value}
        // format, starting with interpolated!
        const productionSeries = view(lensPath([
            'columns',
            data.selected + ' (interpolated)',
        ]), interpolated)
        const extendedYears = {
            ...productionSeries,
            ...repeatLastValue(productionSeries, 100)
        }
        const cumulativeSeries = accumulateDataSeries(extendedYears)
        // console.debug('[Cumulative] Series:', cumulativeSeries)

        return {
            columns: fromPairs([[series, cumulativeSeries]]),
            data: toChartData(series, cumulativeSeries),
            series: [series],
        }
    },
    initialValue,
    [data, interpolated]
)
