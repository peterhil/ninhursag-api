import axios from 'axios'
import { asyncable } from 'svelte-asyncable'
import { errorHandler } from '../lib/api'

export const functions = asyncable(async () => {
    try {
        const res = await axios('/api/v1/estimate')
        return res.data
    } catch (error) {
        errorHandler(error)
        return error
    }
})
