import { createProductionServer } from 'vxrn/serve'

const handler = createProductionServer()

export default {
  async fetch(request, env, ctx) {
    return handler(request, {
      cloudflare: { env, ctx },
    })
  },
}
