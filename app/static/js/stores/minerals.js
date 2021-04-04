import axios from 'axios'
import { asyncable } from 'svelte-asyncable'

export const minerals = asyncable(async () => {
  const res = await axios('/api/v1/minerals')
  return res.data
})
