import { indexBy, prop } from 'ramda'
import { asyncable } from 'svelte-asyncable'

import { errorHandler } from '../lib/api'
import { cleanup } from '../lib/csv'
import { rawData } from './rawData.js'

export const data = asyncable(async ($rawData) => {
    try {
        const rawData = await $rawData
        const parsed = cleanup(rawData)
        const year = prop('Year')

        parsed.data = indexBy(year, parsed.data)
        // console.debug('$data store:', parsed)

        return parsed
    } catch (error) {
        errorHandler(error)
        return error
    }
}, undefined, [rawData])
