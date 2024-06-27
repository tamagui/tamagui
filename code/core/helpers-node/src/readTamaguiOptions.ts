import { join } from 'path'

import type { TamaguiOptions } from '@tamagui/types'
import { pathExists, readJSON } from 'fs-extra'

import { getDefaultTamaguiOptions } from './getDefaultTamaguiOptions'

export async function readTamaguiOptions({ cwd = '.' }: { cwd: string }) {
  const filePath = join(cwd, 'tamagui.json')

  if (!(await pathExists(filePath))) {
    return {
      exists: false,
      options: await getDefaultTamaguiOptions({ cwd }),
    }
  }

  try {
    const options = (await readJSON(filePath)) as TamaguiOptions

    if (!Array.isArray(options.components)) {
      throw new Error(`Invalid components: not string[]`)
    }

    return {
      exists: true,
      options: {
        ...(!options.config && (await getDefaultTamaguiOptions({ cwd }))),
        ...options,
      },
    }
  } catch (err: any) {
    console.error(`Error reading tamagui.json: ${err.message} ${err.stack}`)

    return {
      exists: false,
      options: await getDefaultTamaguiOptions({ cwd }),
    }
  }
}
