import { curry } from 'ramda'
import { writable } from 'svelte/store'
import { randomId } from '../lib/utils'

function createAlerts () {
    const { subscribe, set, update } = writable(new Map())

    const add = curry((type, message) => {
        update(
            (alerts) => {
                const id = randomId()
                alerts.set(id, {id, type, message})
                return alerts
            },
        )
    })

    return {
        subscribe,
        add: add(''),
        success: add('success'),
        secondary: add('secondary'),
        info: add('info'),
        warning: add('warning'),
        error: add('alert'),
        remove: (id) => update(
            (alerts) => {
                alerts.delete(id)
                return alerts
            },
        ),
        reset: () => set(new Map()),
    }
}

export const alerts = createAlerts()
