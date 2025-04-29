import { fromPairs } from 'ramda'
import { asyncable } from 'svelte-asyncable'
import { calculateReserves, getReserves } from '$lib/reserves'
import { cumulative } from '$store/cumulative'
import { reserveData } from '$store/reserveData'
import { mineral } from '$store/mineral'

const initialValue = { columns: {} }

export const reserves = asyncable(
	async (
		$cumulative,
		$mineral,
		$reserveData,
	) => {
		const cumulative = await $cumulative
		const mineral = await $mineral
		const reserveData = await $reserveData
		const series = 'Reserves'

		if (getReserves(reserveData, mineral)) {
			const calculated = calculateReserves(cumulative, reserveData, mineral, 'Cumulative')
			// console.debug('[Reserves] Calculated:', calculated)

			return {
				columns: fromPairs([[series, calculated]]),
				reserves: reserveData,
			}
		}
		else {
			return {
				...initialValue,
				reserves: reserveData,
			}
		}
	},
	initialValue,
	[
		cumulative,
		mineral,
		reserveData,
	]
)
