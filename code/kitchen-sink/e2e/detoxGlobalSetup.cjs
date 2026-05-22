// wraps detox's jest globalSetup with timestamps. the long per-shard startup gap
// sits between jest spawn and the first test; these logs reveal whether it's jest
// core/haste (before globalSetup), detox init (inside globalSetup), or transpile
// (after globalSetup). temporary diagnostic for the detox ci timeout investigation.
module.exports = async (...args) => {
  console.error(`[startup-probe] globalSetup start ${new Date().toISOString()}`)
  const started = Date.now()
  const real = require('detox/runners/jest/globalSetup')
  await (real.default || real)(...args)
  console.error(
    `[startup-probe] globalSetup end ${new Date().toISOString()} (+${Date.now() - started}ms)`
  )
}
