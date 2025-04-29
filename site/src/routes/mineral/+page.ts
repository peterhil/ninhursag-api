import type { PageLoad } from './$types'

import api from '$lib/api'

export const load = (async () => {
	const functions = await api.get('/api/v1/estimate')
	const minerals = await api.get('/api/v1/minerals')

	return {
		functions,
		minerals,
	}
}) satisfies PageLoad
