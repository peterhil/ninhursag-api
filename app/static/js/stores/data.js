import { head, indexBy, last, prop } from 'ramda'
import { asyncable } from 'svelte-asyncable'

import { errorHandler } from '../lib/api'
import { cleanup, productionSeries } from '../lib/csv.js'
import { data as raw } from './raw_data.js'

export const data = asyncable(async ($raw) => {
    try {
        const raw = await $raw
        const parsed = cleanup(raw)
        const year = prop('Year')

        parsed.data = indexBy(year, parsed.data)
        parsed.selected = productionSeries(parsed.series)
        // console.debug('$data store:', parsed)

        return parsed
    } catch (error) {
        errorHandler(error)
        return error
    }
}, undefined, [raw])
