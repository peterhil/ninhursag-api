import axios from 'axios'
import { asyncable } from 'svelte-asyncable'
import { errorHandler } from '../lib/api'


export const images = asyncable(async () => {
    try {
        const res = await axios('/api/v1/images')
        return res.data
    } catch (error) {
        errorHandler(error)
        return error
    }
})
