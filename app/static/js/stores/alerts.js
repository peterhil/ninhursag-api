import { __, curryN } from 'ramda'
import { writable } from 'svelte/store'
import { randomId } from '../lib/utils'

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
                alerts.set(id, {id, type, message})

                if (timeout > 0) {
                    setTimeout(remove, timeout, id)
                }

                return alerts
            },
        )
    })

    return {
        subscribe,
        add,
        message: add('', __, 4000),
        secondary: add('secondary', __, 4000),
        success: add('success', __, 4000),
        info: add('info', __, 4000),
        warning: add('warning', __, 8000),
        error: add('alert', __, 8000),
        remove,
        reset: () => set(new Map()),
    }
}

export const alerts = createAlerts()
