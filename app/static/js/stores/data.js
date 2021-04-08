import { asyncable } from 'svelte-asyncable'
import { errorHandler } from '../lib/api'
import { cleanup } from '../lib/csv.js'
import { data as raw } from './raw_data.js'

export const data = asyncable(async ($raw) => {
    try {
        const raw = await $raw
        const parsed = cleanup(raw)
        console.debug('$data store:', parsed)

        return parsed
    } catch (error) {
        errorHandler(error)
        return error
    }
}, undefined, [raw])
