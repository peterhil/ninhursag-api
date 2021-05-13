import axios from 'axios'
import { asyncable } from 'svelte-asyncable'

import { errorHandler } from '../lib/api'
import { cleanup } from '../lib/csv'
import { mineral } from './mineral.js'
import { minerals } from './minerals.js'


export const data = asyncable(async ($mineral, $minerals) => {
    try {
        const mineral = await $mineral
        const minerals = await $minerals
        if (!mineral) {
            return []
        }
        const src = minerals[mineral]
        const url = `/static/data/tsv/${src}`
        // console.debug('[Data] Fetching:', url)

        const res = await axios(url)
        const rawData = res.data
        // console.debug('[Data] Raw data:', rawData)

        const parsed = cleanup(rawData)
        // console.debug('[Data] Store:', parsed)

        return parsed
    } catch (error) {
        errorHandler(error)
        return error
    }
}, undefined, [mineral, minerals])
