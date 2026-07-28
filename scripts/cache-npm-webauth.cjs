const Module = require('node:module')

const load = Module._load

Module._load = function (request, parent, isMain) {
  const loaded = load.call(this, request, parent, isMain)

  if (request.endsWith('/commands/publish.js')) {
    loaded.prototype.execWorkspaces = async function () {
      await this.setWorkspaces()
      for (const workspace of this.workspaces.values()) {
        await this.exec([workspace])
      }
    }
  }

  return loaded
}
