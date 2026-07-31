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
      for (const workspace of this.workspaces.values()) {
        try {
          await this.exec([workspace])
        } catch (error) {
          if (!isAuthFailure(error)) {
            throw error
          }

          resetApproval()
          await this.exec([workspace])
        }
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
        approval = loaded.webAuthOpener(...args).catch((error) => {
          resetApproval()
          throw error
        })
      }
      return approval
    },
  }

}
