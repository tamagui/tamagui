/* eslint-disable no-console */
import arg from 'arg'
import chalk from 'chalk'

import { generatedPackageTypes } from './add.js'
import { disposeAll, getOptions } from './utils'

;['exit', 'SIGINT'].forEach((_) => {
  process.on(_, () => {
    disposeAll()
    process.exit()
  })
})

const COMMAND_MAP = {
  'generate-themes': {
    shorthands: ['gt'],
    description: `Use to pre-build your themes`,
    flags: {
      '--help': Boolean,
      '--debug': Boolean,
      '--verbose': Boolean,
    },
    async run() {
      const { _, ...flags } = arg(this.flags)
      const options = await getOptions({
        debug: flags['--debug'] ? (flags['--verbose'] ? 'verbose' : true) : false,
      })
      const [_cmd, inPath, outPath] = _
      if (!inPath || !outPath) {
        throw new Error(
          `Must supply both input and output paths, missing one (inPath: ${inPath}, outPath: ${outPath})`
        )
      }

      const { generateThemes, writeGeneratedThemes } = require('@tamagui/generate-themes')

      await writeGeneratedThemes(
        options.paths.dotDir,
        outPath,
        await generateThemes(inPath)
      )
    },
  },

  add: {
    shorthands: ['a'],
    description: `Use to add fonts and icons to your monorepo. Supported types: ${generatedPackageTypes.join(
      ', '
    )}`,
    flags: {
      '--help': Boolean,
      '--debug': Boolean,
      '--verbose': Boolean,
    },
    async run() {
      const { _, ...flags } = arg(this.flags)
      const { installGeneratedPackage } = require('./add.js')
      const [cmd, type, path] = _
      // const options = await getOptions({
      //   debug: flags['--debug'] ? (flags['--verbose'] ? 'verbose' : true) : false,
      // })
      await installGeneratedPackage(type, path)
    },
  },

  // build: {
  //   shorthands: ['b'],
  //   description: `Use to pre-build a Tamagui component directory`,
  //   flags: {
  //     '--help': Boolean,
  //     '--debug': Boolean,
  //     '--verbose': Boolean,
  //   },
  //   async run() {
  //     const { _, ...flags } = arg(this.flags)
  //     const { build } = await import('./build')
  //     const options = await getOptions({
  //       debug: flags['--debug'] ? (flags['--verbose'] ? 'verbose' : true) : false,
  //     })
  //     await build(options)
  //   },
  // },
  // update: {
  //   shorthands: [],
  //   description: `Update all tamagui packages within a monorepo`,
  //   flags: {},
  //   async run() {
  //     const { update } = await import('./update')
  //     await update()
  //   },
  // },

  dev: {
    shorthands: ['d'],
    description: `Run tamagui vite`,
    flags: {
      '--help': Boolean,
      '--debug': Boolean,
      '--verbose': Boolean,
    },
    async run() {
      const { _, ...flags } = arg(this.flags)
      const { dev } = require('./dev')
      const options = await getOptions({
        debug: flags['--debug'] ? (flags['--verbose'] ? 'verbose' : true) : false,
      })
      await dev(options)
    },
  },

  studio: {
    shorthands: ['s'],
    description: `Studio`,
    flags: {
      '--help': Boolean,
      '--debug': Boolean,
      '--verbose': Boolean,
      '--remote': Boolean,
    },
    async run() {
      const { _, ...flags } = arg(this.flags)
      const { studio } = require('./studio')
      const options = await getOptions({
        debug: flags['--debug'] ? (flags['--verbose'] ? 'verbose' : true) : false,
      })
      await studio(options, flags['--remote'])
    },
  },
}

type CommandDefinitions = typeof COMMAND_MAP
type CommandKey = keyof typeof COMMAND_MAP
type CommandDefinition = CommandDefinitions[CommandKey]

const commandEntries = Object.keys(COMMAND_MAP).flatMap((command) => {
  const definition = COMMAND_MAP[command as CommandKey]
  const entries = [command, ...definition.shorthands].map((cmd) => {
    return [cmd, definition] as const
  })
  return entries
})

const commands = Object.fromEntries(commandEntries) as any as Record<
  CommandKey,
  CommandDefinition
>

const {
  _: [command],
  ...flags
} = arg(
  {
    '--help': Boolean,
    '--version': Boolean,
  },
  {
    permissive: true,
  }
)

if (flags['--version']) {
  console.log(require('../package.json').version)
  process.exit(0)
}

if (!command && flags['--help']) {
  console.log(`$ tamagui

commands:

${Object.keys(COMMAND_MAP)
  .map((key) => {
    return `  ${key}`
  })
  .join('\n')}`)
  process.exit(0)
}

if (!(command in commands)) {
  console.error()
  console.warn(chalk.yellow(`Not a valid command: ${command}`))
  process.exit(1)
}

const definition = commands[command] as CommandDefinition

main()

async function main() {
  if (flags['--help']) {
    console.log(`\n$ tamagui ${command}: ${definition.description}\n`)
    console.log(
      `Flags: ${Object.entries(definition.flags).map(([k, v]) => `${k} (${v.name})`)}`
    )
    process.exit(0)
  }

  const { _, ...cmdFlags } = arg(definition.flags)

  // help for any command
  if (cmdFlags['--help']) {
    console.log(`$ tamagui ${_}

    Flags: ${JSON.stringify(cmdFlags, null, 2)}

`)
    process.exit(0)
  }

  try {
    await definition.run()
  } catch (err: any) {
    console.error(`Error running command: ${err.message}`)
  }

  process.exit(0)
}

function showHelp(definition: CommandDefinition, flags: { '--help'?: boolean }) {
  if (flags['--help']) {
    console.log(`$ ${definition}`)
  }
}

// async function main() {
//   const options = await getOptions({
//     host: flags['--host'],
//   })

//   switch (command) {
//     // build
//     case 'b':
//     case 'build': {
//       const { build } = await import('./build')
//       break
//     }

//     // generate
//     case 'generate':
//     case 'gen': {
//       const { generateTamaguiConfig: generateTamgauiConfig } = await import(
//         './tamaguiConfigUtils.js'
//       )
//       const { generateTypes } = await import('./generate')

//       if (props[0] === 'types') {
//         await generateTypes(options)
//         return
//       }
//       if (props[0] === 'config') {
//         await generateTamgauiConfig(options)
//         return
//       }

//       await Promise.all([
//         // all
//         generateTypes(options),
//         generateTamgauiConfig(options),
//       ])
//       break
//     }

//     // for now, dev === serve, eventually serve can be just prod mode
//     case 'dev': {
//       const { dev } = await import('./dev')
//       await dev(options)
//       break
//     }

//     default: {
//       if (!command || flags['--help']) {
//       }
//       // rome-ignore lint/nursery/noConsoleLog: ok
//       console.warn(chalk.yellow(`No command found ${command}`))
//       process.exit(1)
//     }
//   }
// }
