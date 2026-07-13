import { resolution as conditionalResolution } from '@fixture/conditional'
import { resolution as commandResolution } from '#command-resolution'
import { resolution as pluginResolution } from '#plugin-resolution'
import { resolution as workspaceResolution } from '#workspace-resolution'

export const compilerResolution = `${conditionalResolution}:${workspaceResolution}:${pluginResolution}:${commandResolution}`
