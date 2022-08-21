import { useServerRequest } from '../ServerRequestProvider/index.js'

/** The `useSession` hook reads session data in server components. */
export const useSession = function () {
  const request = useServerRequest()
  const session = request.ctx.session?.get() || {}
  return session
}

export const useFlashSession = function (key: string) {
  const request = useServerRequest()
  const data = request.ctx.session?.get() || {}
  let value = data[key]

  if (value) {
    delete data[key]
    request.ctx.flashSession[key] = value
  }
  request.ctx.session?.set(data)

  value = request.ctx.flashSession[key]
  delete request.ctx.flashSession[key]

  return value
}
