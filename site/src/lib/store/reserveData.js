import { asyncable } from 'svelte-asyncable'
import api from '$lib/api'

export const reserveData = asyncable(async () => {
	return await api.get('/api/v1/reserves')
})
