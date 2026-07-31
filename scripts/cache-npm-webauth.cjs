const Module = require('node:module')

const load = Module._load
let approval

const resetApproval = () => {
  approval = undefined
}

const isAuthFailure = (error) => {
  if (error?.code === 'EOTP') {
    return true
  }

  return (
    error?.code === 'E401' &&
    /one-time pass|one[- ]time password|two-factor|2fa|otp/i.test(
      `${error.message || ''}\n${error.body || ''}`
    )
  )
}

Module._load = function (request, parent, isMain) {
  const loaded = load.call(this, request, parent, isMain)

  if (request.endsWith('/commands/publish.js')) {
    loaded.prototype.execWorkspaces = async function () {
      await this.setWorkspaces()
      const workspaces = [...this.workspaces.values()]
      const failures = []

      for (let index = 0; index < workspaces.length; index += 6) {
        let pending = workspaces.slice(index, index + 6)

        for (let attempt = 0; pending.length > 0 && attempt < 2; attempt++) {
          const results = await Promise.allSettled(
            pending.map((workspace) => this.exec([workspace]))
          )
          const rejected = results.flatMap((result, resultIndex) =>
            result.status === 'rejected' ? [pending[resultIndex]] : []
          )

          if (
            rejected.length > 0 &&
            results.some((result) => {
              return result.status === 'rejected' && isAuthFailure(result.reason)
            })
          ) {
            resetApproval()
          }

          pending = rejected
        }

        failures.push(...pending)
      }

      if (failures.length > 0) {
        throw new AggregateError(
          failures.map((workspace) => new Error(`Failed to publish ${workspace}`)),
          `${failures.length} workspace publish${failures.length === 1 ? '' : 'es'} failed`
        )
      }
    }
  }

  if (request !== 'npm-profile' || typeof loaded.webAuthOpener !== 'function') {
    return loaded
  }

  return {
    ...loaded,
    webAuthOpener: (...args) => {
      if (!approval) {
        approval = Promise.resolve()
          .then(() => loaded.webAuthOpener(...args))
          .catch((error) => {
            resetApproval()
            throw error
          })
      }
      return approval
    },
  }
}
