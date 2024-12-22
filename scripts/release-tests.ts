import { spawnify } from './spawnify'

await spawnify(`yarn fix:deps`)
await spawnify(`yarn lint`)
await spawnify(`yarn check`)
await spawnify(`yarn test:ci`)
