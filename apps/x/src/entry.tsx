import { createApp } from 'vxs'

export default createApp({
  routes: import.meta.glob('../app/**/*.tsx'),
})
