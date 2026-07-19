const Module = require('node:module')

const load = Module._load
let approval

Module._load = function (request, parent, isMain) {
  const loaded = load.call(this, request, parent, isMain)

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
