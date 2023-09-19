// @ts-ignore
import getDevServer from 'react-native/Libraries/Core/Devtools/getDevServer'

export interface DevServerLocation {
  host: string
  hostname: string
  href: string
  origin: string
  pathname: string
  port?: string
  protocol?: string
}

let location: DevServerLocation | undefined

export function getDevServerLocation(): DevServerLocation {
  if (!location) {
    const { url } = getDevServer() as { url: string }
    const origin = url.replace(/\/$/, '')
    const host = origin.replace(/https?:\/\//, '')
    location = {
      host,
      hostname: host.split(':')[0],
      href: url,
      origin,
      pathname: url.split(host)[1],
      port: host.split(':')[1],
      protocol: (url.match(/^([a-z])+:\/\//) || [undefined, undefined])[1],
    }
  }

  return location
}
