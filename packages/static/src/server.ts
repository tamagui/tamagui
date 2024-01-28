import type { TamaguiOptions } from './types'

import net from 'node:net'

export async function startServer(options: TamaguiOptions) {
  const port = await getAvailablePort()
  const server = net.createServer()
  server.unref()

  await new Promise((resolve, reject) => {
    server.on('error', reject)
    server.on('connection', (conn) => {
      conn.on('data', (data) => {
        console.info('got', data.toString())
      })
    })
    server.listen({ port }, () => {
      const { port } = server.address() as net.AddressInfo
      server.close(() => {
        resolve(port)
      })
    })
  })
}

async function getAvailablePort(port = 8089): Promise<number> {
  return checkAvailablePort(port).catch(() => getAvailablePort(port + 1))
}

function checkAvailablePort(port: number) {
  return new Promise<number>((resolve, reject) => {
    const server = net.createServer()
    server.unref()
    server.on('error', reject)

    server.listen({ port }, () => {
      const { port } = server.address() as net.AddressInfo
      server.close(() => {
        resolve(port)
      })
    })
  })
}
