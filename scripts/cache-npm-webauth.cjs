const Module = require('node:module')

const load = Module._load
let approval

Module._load = function (request, parent, isMain) {
  const loaded = load.call(this, request, parent, isMain)

  if (request.endsWith('/commands/publish.js')) {
    loaded.prototype.execWorkspaces = async function () {
      await this.setWorkspaces()
      const workspaces = [...this.workspaces.values()]
      for (let index = 0; index < workspaces.length; index += 6) {
        await Promise.all(
          workspaces.slice(index, index + 6).map((workspace) => this.exec([workspace]))
        )
        if (index + 6 < workspaces.length) {
          await new Promise((resolve) => setTimeout(resolve, 1000))
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
        approval = loaded.webAuthOpener(...args)
      }
      return approval
    },
  }
}
