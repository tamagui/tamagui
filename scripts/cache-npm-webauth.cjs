const Module = require('node:module')

const load = Module._load

Module._load = function (request, parent, isMain) {
  const loaded = load.call(this, request, parent, isMain)

  if (request.endsWith('/commands/publish.js')) {
    loaded.prototype.execWorkspaces = async function () {
      await this.setWorkspaces()
      const workspaces = [...this.workspaces.values()]
      const failures = []

      for (let index = 0; index < workspaces.length; index += 6) {
        const results = await Promise.allSettled(
          workspaces.slice(index, index + 6).map((workspace) => this.exec([workspace]))
        )

        failures.push(
          ...results.flatMap((result) =>
            result.status === 'rejected' ? [result.reason] : []
          )
        )
      }

      if (failures.length > 0) {
        throw new AggregateError(
          failures,
          `${failures.length} workspace publish${failures.length === 1 ? '' : 'es'} failed`
        )
      }
    }
  }

  return loaded
}
