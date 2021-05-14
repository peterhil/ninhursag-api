import { asyncable } from 'svelte-asyncable'

import api from '../lib/api'
import { cleanup } from '../lib/csv'
import { alerts } from '../stores/alerts'
import { mineral } from './mineral.js'
import { minerals } from './minerals.js'

function errorHandler (error) {
    // console.error('Error happened:', error)
    alerts.error(error.message)
    throw error
}

export const data = asyncable(async ($mineral, $minerals) => {
    const mineral = await $mineral
    const minerals = await $minerals
    if (!mineral) {
        return []
    }
    const src = minerals[mineral]
    // const url = `/static/data/tsv/${src}`
    const url = encodeURI('/api/v1/mineral/' + mineral)
    // console.debug('[Data] Fetching:', url)

    const parsed = await api.get(
        url,
        (rawData) => cleanup(rawData),
        errorHandler,
    )
    // console.debug('[Data] Store:', parsed)

    return parsed
}, undefined, [mineral, minerals])
