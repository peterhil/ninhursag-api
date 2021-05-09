import axios from 'axios'
import { asyncable } from 'svelte-asyncable'
import { errorHandler } from '../lib/api'
import { mineral } from './mineral.js'
import { minerals } from './minerals.js'

export const rawData = asyncable(async ($mineral, $minerals) => {
    try {
        const mineral = await $mineral
        const minerals = await $minerals
        if (!mineral) {
            return []
        }
        const src = minerals[mineral]
        const url = `/static/data/tsv/${src}`
        // console.debug('Fetching data:', url)
        const res = await axios(url)

        return res.data
    } catch (error) {
        errorHandler(error)
        return error
    }
}, undefined, [mineral, minerals])
