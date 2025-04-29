import { derived } from 'svelte/store'

import { cumulative } from '$store/cumulative'
import { cumulativeFit } from '$store/cumulativeFit'
import { data } from '$store/data'
import { estimate } from '$store/estimate'
import { interpolated } from '$store/interpolated'
import { reserves } from '$store/reserves'
import { reservesFit } from '$store/reservesFit'

const initialValue = { data: {}, reserves: {}, columns: {} }

export const chart = derived(
	[
		data,
		cumulative,
		interpolated,
		reserves,
		estimate,
		cumulativeFit,
		reservesFit,
	],
	async ([
		$data,
		$cumulative,
		$interpolated,
		$reserves,
		$estimate,
		$cumulativeFit,
		$reservesFit,
	], set) => {
		const data = await $data
		const interpolated = await $interpolated
		const cumulative = await $cumulative
		const reserves = await $reserves

		const calculated = {
			...data,
			columns: {
				...data.columns,
				...interpolated.columns,
				...cumulative.columns,
				...reserves.columns,
			}
		}
		// console.debug('[Chart] Calculated data:', calculated)
		set(calculated)

		const estimate = await $estimate
		const cumulativeFit = await $cumulativeFit
		const reservesFit = await $reservesFit

		const estimated = {
			...calculated,
			columns: {
				...calculated.columns,
				...cumulativeFit.columns,
				...reservesFit.columns,
				...estimate.columns,
			}
		}
		// console.debug('[Chart] Estimated data:', estimated)
		set(estimated)
	},
	initialValue,
)
