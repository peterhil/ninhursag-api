import { __, curryN } from 'ramda'
import { writable } from 'svelte/store'
import { randomId } from '$lib/utils'

const levels = [
	'info',
	'tip',
	'success',
	'failure',
	'warning',
	'error',
]

export function maxLevel (alerts) {
	const data = [...alerts.values()].map(v => levels.indexOf(v.type))
	const max = data.reduce((a, b) => Math.max(a, b), 0)
	const level = levels[max]

	return level
}

function createAlerts () {
	const { subscribe, set, update } = writable(new Map())

	const remove = (id) => update(
		(alerts) => {
			alerts.delete(id)
			return alerts
		},
	)

	const add = curryN(3, (type, message, timeout) => {
		update(
			(alerts) => {
				const id = randomId()
				alerts.set(id, { id, type, message })

				if (timeout > 0) {
					setTimeout(remove, timeout, id)
				}

				return alerts
			},
		)
	})

	return {
		subscribe,
		remove,
		add,
		reset: () => set(new Map()),
		// Levels
		info: add('info', __, 4000),
		tip: add('tip', __, 4000),
		success: add('success', __, 4000),
		failure: add('failure', __, 4000),
		warning: add('warning', __, 4000),
		error: add('error', __, 4000),
	}
}

export const alerts = createAlerts()
