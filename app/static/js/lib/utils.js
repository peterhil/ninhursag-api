import { init, join } from 'ramda'

export function currentPath (url) {
    join('/', init(url.split('/')))
}
