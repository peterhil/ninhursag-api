import { asyncable } from 'svelte-asyncable'

import api from '$lib/api'
import { cleanup } from '$lib/csv'
import { alerts } from '$store/alerts'
import { mineral } from '$store/mineral.js'

function errorHandler (error) {
	alerts.error(error.message)
	throw error
}

export const data = asyncable(
	async ($mineral) => {
		const mineral = await $mineral

		const url = encodeURI('/api/v1/mineral/' + mineral)
		// console.debug('[Data] Fetching:', url)

		const parsed = await api.get(
			url,
			(rawData) => cleanup(rawData),
			errorHandler,
		)
		// console.debug('[Data] Store:', parsed)

		return parsed
	},
	undefined,
	[mineral]
)
