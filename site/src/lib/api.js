import { identity } from 'ramda'

export const API_SERVER = 'http://localhost:5000'

function isJson (response) {
	return response.headers.get('Content-Type') === 'application/json'
}

async function handleResponse (response) {
	const method = isJson(response) ? 'json' : 'text'
	const body = await response[method]()

	if (response.ok) {
		return body
	}
	else {
		const msg = (method === 'json' ? body.errors : body)
		throw new Error(msg)
	}
}

export async function get (
	url,
	success = identity,
	failure = console.error,
) {
	return await fetch(API_SERVER + url)
		.then(handleResponse)
		.then(success)
		.catch(failure)
}

export async function post (
	url,
	data = {},
	success = identity,
	failure = console.error,
) {
	return await fetch(API_SERVER + url, {
		...data,
		// Force these parameters (override data parameters):
		method: 'POST',
		mode: 'cors',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data.body),
	})
		.then(handleResponse)
		.then(success)
		.catch(failure)
}

const api = {
	get,
	post,
}

export default api
