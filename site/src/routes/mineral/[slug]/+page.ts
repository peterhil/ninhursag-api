import type { PageLoad } from './$types'

import api from '$lib/api'

export const load = (async ({ params }) => {
	const functions = await api.get('/api/v1/estimate')
	const minerals = await api.get('/api/v1/minerals')
	const mineral = (params.slug in minerals ? params.slug : '')

	return {
		functions,
		mineral,
		minerals,
	}
}) satisfies PageLoad
