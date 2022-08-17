// Provide Unagi config loader to external tools like the CLI

import { VIRTUAL_PROXY_UNAGI_CONFIG_ID } from './plugins/virtualFilesPlugin.js'
import { viteception } from './viteception.js'

export async function loadConfig(options = { root: process.cwd() }) {
  const { loaded } = await viteception([VIRTUAL_PROXY_UNAGI_CONFIG_ID], options)

  return { configuration: loaded[0].default }
}
