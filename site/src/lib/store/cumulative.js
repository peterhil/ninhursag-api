import {
	fromPairs,
	lensPath,
	view,
} from 'ramda'
import { asyncable } from 'svelte-asyncable'
import { accumulateDataSeries } from '$lib/cumulative'
import { repeatLastValue } from '$lib/data'
import { interpolated } from '$store/interpolated'

const initialValue = { columns: {} }

export const cumulative = asyncable(
	async ($interpolated) => {
		const interpolated = await $interpolated
		const series = 'Cumulative'
		// console.debug('[Cumulative] Data and interpolated:', data, interpolated)

		// TODO Change all column data handling to use {year: value}
		// format, starting with interpolated!
		const productionSeries = view(lensPath([
			'columns',
			'World production (interpolated)',
		]), interpolated)
		const extendedYears = {
			...productionSeries,
			...repeatLastValue(productionSeries, 100)
		}
		const cumulativeSeries = accumulateDataSeries(extendedYears)
		// console.debug('[Cumulative] Series:', cumulativeSeries)

		return {
			columns: fromPairs([[series, cumulativeSeries]]),
		}
	},
	initialValue,
	[interpolated]
)
