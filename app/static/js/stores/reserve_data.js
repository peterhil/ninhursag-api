import axios from 'axios'
import { asyncable } from 'svelte-asyncable'
import { errorHandler } from '../lib/api'

export const reserve_data = asyncable(async () => {
    try {
        const res = await axios('/api/v1/reserves')
        // console.debug('Reserves:', res.data)

        return res.data
    } catch (error) {
        errorHandler(error)
        return error
    }
})
