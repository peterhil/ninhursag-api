import { readable } from 'svelte/store'

function createStore () {
    const store = readable({ data: {} }, function start (set) {
        set({ loading: true })
        fetch('/api/v1/minerals')
            .then(async (response) => {
                if (!response.ok) {
                    const text = await response.text()
                    throw new Error(text)
                }

                return await response.json()
            })
            .then((json) => {
                set({ data: json })
            })
            .catch((error) => {
                set({ error: error.message })
            })

        return function stop () {
            // Nothing to be done on unsubscribe
        }
    })

    return store
}

export const minerals = createStore()
