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
        let pending = workspaces.slice(index, index + 6)

        for (let attempt = 0; pending.length > 0 && attempt < 2; attempt++) {
          const results = await Promise.allSettled(
            pending.map((workspace) => this.exec([workspace]))
          )

          pending = results.flatMap((result, resultIndex) =>
            result.status === 'rejected' ? [pending[resultIndex]] : []
          )
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

  return loaded
}
