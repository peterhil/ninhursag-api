import {
	fromPairs,
	lensPath,
	view,
} from 'ramda'
import { asyncable } from 'svelte-asyncable'

import { accumulateDataSeries } from '$lib/cumulative'
import { estimate } from '$store/estimate'

const initialValue = { columns: {} }

export const cumulativeFit = asyncable(
	async ($estimate) => {
		const estimate = await $estimate
		const series = 'Cumulative fit'
		// console.debug('[Cumulative fit] Estimate:', estimate)

		if (!estimate.data) { return initialValue }

		// TODO Change all column data handling to use {year: value}
		// format, starting with interpolated!
		const productionSeries = view(lensPath([
			'columns',
			estimate.estimate,
		]), estimate)
		const cumulativeSeries = accumulateDataSeries(productionSeries)
		// console.debug('[Cumulative fit] Cumulative data:', cumulativeSeries)

		return {
			columns: fromPairs([[series, cumulativeSeries]]),
		}
	},
	initialValue,
	[estimate],
)
