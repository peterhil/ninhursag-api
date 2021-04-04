import { readable } from 'svelte/store'
import { asyncable } from 'svelte-asyncable'

export const minerals = asyncable(async () => {
  const res = await fetch('/api/v1/minerals')
  return res.json()
})
