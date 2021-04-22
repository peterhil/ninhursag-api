import { alerts } from '../stores/alerts'

// Handle axios errors from backend API so that they can be shown
export function errorHandler (error) {
    if (error.response) {
        const response = error.response

        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error(response.data)
        console.log(response.status)
        console.log(response.headers)

        alerts.error(response.data.errors.join('\n'))

        throw new Error(error.response.data.errors)
    } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request)
    } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message)
    }

    console.log(error.config)
    throw error
}
