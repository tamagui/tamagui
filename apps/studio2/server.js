// @ts-check
import fs from 'node:fs'
import { createServer as nodeCreateServer } from 'node:http'
import path from 'node:path'

import { createApp, defineEventHandler, toNodeListener } from 'h3'
import sirv from 'sirv'

const bootstrap = async () => {
  const app = createApp()

  const sirvMiddleware = sirv('dist/client', {
    gzip: true,
  })

  app.use(
    defineEventHandler(async ({ node: { req, res } }) => {
      return await new Promise((response) => {
        sirvMiddleware(req, res, (value) => {
          response(value)
        })
      })
    })
  )

  app.use(
    defineEventHandler(async ({ node: { req, res } }) => {
      const url = req.originalUrl
      const template = fs.readFileSync(path.resolve('dist/client/index.html'), 'utf-8')
      // @ts-ignore
      const render = (await import('./dist/server/entry-server.js')).render
      const appHtml = await render({ path: url })
      const html = template.replace(`<!--ssr-outlet-->`, appHtml)
      res.setHeader('Content-Type', 'text/html')
      return html
    })
  )

  const server = nodeCreateServer(toNodeListener(app))

  return { app, server }
}

bootstrap()
  .then(async ({ server }) => {
    server.listen(3333)
    console.info(`Listening on http://localhost:3333`)
  })
  .catch(console.error)
