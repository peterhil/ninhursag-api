import { identity } from 'ramda'

import { alerts } from '../stores/alerts'

// Handle axios errors from backend API so that they can be shown
export function errorHandler (error) {
    if (error.response) {
        const response = error.response

        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx

        // console.error(response.data)
        // console.log(response.status)
        // console.log(response.headers)

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

    // console.log(error.config)
    throw error
}

function isJson (response) {
    return response.headers.get('Content-Type') === 'application/json'
}

async function handleResponse (response) {
    if (response.ok) {
        const method = isJson(response) ? 'json' : 'text'
        const res = await response[method]()

        return res
    } else {
        const text = await response.text()
        const status = [
            'HTTP',
            response.status,
            response.statusText,
        ].join(' ')

        throw new Error(status + ': ' + text)
    }
}

export async function get (
    url,
    success = identity,
    failure = console.error,
) {
    return await fetch(url)
        .then(handleResponse)
        .then(success)
        .catch(failure)
}

const api = {
    get,
    // post,
}

export default api
