const Module = require('node:module')

const { publishInBatches } = require('./release-publish-batches.cjs')

const load = Module._load
let approval

const resetApproval = () => {
  approval = undefined
}

Module._load = function (request, parent, isMain) {
  const loaded = load.call(this, request, parent, isMain)

  if (request.endsWith('/commands/publish.js')) {
    loaded.prototype.execWorkspaces = async function () {
      await this.setWorkspaces()
      const workspaces = [...this.workspaces.values()]
      const failures = await publishInBatches({
        workspaces,
        publish: (workspace) => this.exec([workspace]),
        onAuthFailure: resetApproval,
      })

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
