import axios from 'axios'
import { asyncable } from 'svelte-asyncable'
import { errorHandler } from '../lib/api'

export const minerals = asyncable(async () => {
    try {
        const res = await axios('/api/v1/minerals')
        return res.data
    } catch (error) {
        errorHandler(error)
        return error
    }
})
