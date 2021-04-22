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

    const add = curryN(3, (message, type, timeout) => {
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
        add: add(__, '', 4000),
        success: add(__, 'success', 4000),
        secondary: add(__, 'secondary', 4000),
        info: add(__, 'info', 4000),
        warning: add(__, 'warning', 8000),
        error: add(__, 'alert', 8000),
        remove,
        reset: () => set(new Map()),
    }
}

export const alerts = createAlerts()
