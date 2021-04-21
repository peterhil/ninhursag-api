import Cookies from 'js-cookie'
import { writable } from 'svelte/store'
import { currentPath } from '../lib/utils'

// Store to read and persist a simple string valued cookie by key
//
// For more complex objects, use localStorage with JSON.stringify
// and JSON.parse as in section "Implementing our custom todos store" here:
// https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/Svelte_stores#using_the_store_contract_to_persist_our_todos
export function cookieStore (key, defaultValue = '') {
    const saved = Cookies.get(key) || defaultValue
    const { subscribe, set, update } = writable(saved)

    return {
		subscribe,
        set: (value) => {
            Cookies.set(key, value, {
                path: currentPath(document.location.pathname),
                sameSite: 'strict',
            })
            return set(value)
        },
        update,
	};
}
