import { fromPairs } from 'ramda'
import { asyncable } from 'svelte-asyncable'

import { productionSeries } from '$lib/data'
import { interpolateData } from '$lib/interpolate'
import { data } from '$store/data'

const initialValue = { columns: {} }

export const interpolated = asyncable(
	async ($data) => {
		const data = await $data

		const series = 'World production (interpolated)'
		const production = productionSeries(data.columns)
		const interpolated = interpolateData(production)
		// console.debug('[Interpolated] Data:', interpolated)

		return {
			columns: fromPairs([[series, interpolated]]),
		}
	},
	initialValue,
	[data]
)
