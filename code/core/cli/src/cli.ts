import arg from 'arg'
import chalk from 'chalk'

import { generatedPackageTypes } from './add'
import { disposeAll, getOptions } from './utils'
import { loadTamagui, checkDeps } from '@tamagui/static'

// exit handlers
;['exit', 'SIGINT'].forEach((_) => {
  process.on(_, () => {
    disposeAll()
    process.exit()
  })
})

const COMMAND_MAP = {
  check: {
    description: `Checks your dependencies for inconsistent versions.`,
    shorthands: [],
    flags: {
      '--help': Boolean,
      '--debug': Boolean,
      '--verbose': Boolean,
    },
    async run() {
      const { _, ...flags } = arg(this.flags)
      const options = await getOptions({
        debug: flags['--debug'] ? (flags['--verbose'] ? 'verbose' : true) : false,
        loadTamaguiOptions: true,
      })

      await checkDeps(options.paths.root)
    },
  },

  generate: {
    description: `Builds your entire tamagui configuration and outputs any CSS.`,
    shorthands: [],
    flags: {
      '--help': Boolean,
      '--debug': Boolean,
      '--verbose': Boolean,
    },
    async run() {
      const { _, ...flags } = arg(this.flags)
      const options = await getOptions({
        debug: flags['--debug'] ? (flags['--verbose'] ? 'verbose' : true) : false,
        loadTamaguiOptions: true,
      })
      process.env.TAMAGUI_KEEP_THEMES = '1'
      await loadTamagui({
        ...options.tamaguiOptions,
        platform: 'web',
      })

      // Also generate prompt to .tamagui/prompt.md
      const { generatePrompt } = require('./generate-prompt')
      const { join } = require('node:path')
      await generatePrompt({
        ...options,
        output: join(options.paths.dotDir, 'prompt.md'),
      })
    },
  },

  'generate-css': {
    shorthands: [],
    description: `Generate the tamagui.generated.css file from your config`,
    flags: {
      '--help': Boolean,
      '--debug': Boolean,
      '--verbose': Boolean,
      '--output': String,
    },
    async run() {
      const { _, ...flags } = arg(this.flags)
      const options = await getOptions({
        debug: flags['--debug'] ? (flags['--verbose'] ? 'verbose' : true) : false,
        loadTamaguiOptions: true,
      })

      const outputPath =
        flags['--output'] || options.tamaguiOptions.outputCSS || './tamagui.generated.css'

      process.env.TAMAGUI_KEEP_THEMES = '1'
      await loadTamagui({
        ...options.tamaguiOptions,
        outputCSS: outputPath,
        platform: 'web',
      })

      console.info(`Generated CSS to ${outputPath}`)
    },
  },

  'generate-themes': {
    shorthands: [],
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

      try {
        const generated = await generateThemes(inPath)

        if (generated) {
          await writeGeneratedThemes(options.paths.dotDir, outPath, generated)
          console.info(`Successfully generated themes to ${outPath}`)
        } else {
          process.exit(1)
        }
      } catch (err) {
        console.error(`Error generating themes: ${err}`)
        return
      }
    },
  },

  add: {
    shorthands: [],
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
      const { installGeneratedPackage } = require('./add')
      const [cmd, type, path] = _
      // const options = await getOptions({
      //   debug: flags['--debug'] ? (flags['--verbose'] ? 'verbose' : true) : false,
      // })
      await installGeneratedPackage(type, path)
    },
  },

  build: {
    shorthands: ['b'],
    description: `Use to pre-build a Tamagui component directory. Use -- to run a command after optimization, then auto-restore files.`,
    flags: {
      '--help': Boolean,
      '--debug': Boolean,
      '--verbose': Boolean,
      '--dry-run': Boolean,
      '--target': String,
      '--include': String,
      '--exclude': String,
      '--output': String,
      '--expect-optimizations': Number,
    },
    async run() {
      // Find -- separator in process.argv
      const argvSeparatorIdx = process.argv.indexOf('--')
      let runCommand: string[] | undefined

      if (argvSeparatorIdx !== -1) {
        // Everything after -- is the command to run
        runCommand = process.argv.slice(argvSeparatorIdx + 1)
        // Parse only args before --
        const argsBeforeSeparator = process.argv.slice(0, argvSeparatorIdx)
        process.argv = argsBeforeSeparator
      }

      const { _, ...flags } = arg(this.flags)
      const [_command, dir] = _

      const dryRun = flags['--dry-run'] || false
      const debug = flags['--debug']
        ? flags['--verbose']
          ? ('verbose' as const)
          : true
        : false

      const { build } = require('./build.cjs')
      const options = await getOptions({
        debug,
      })
      await build({
        ...options,
        dir,
        include: flags['--include'],
        target: (flags['--target'] as 'web' | 'native' | 'both' | undefined) || 'both',
        exclude: flags['--exclude'],
        output: flags['--output'],
        expectOptimizations: flags['--expect-optimizations'],
        runCommand,
        dryRun,
      })
    },
  },

  upgrade: {
    shorthands: ['up'],
    description: `Upgrade all tamagui packages in your workspace to the latest version`,
    flags: {
      '--help': Boolean,
      '--debug': Boolean,
      '--from': String,
      '--to': String,
      '--changelog-only': Boolean,
      '--dry-run': Boolean,
    },
    async run() {
      const { _, ...flags } = arg(this.flags)
      const { upgrade } = require('./upgrade')
      await upgrade({
        from: flags['--from'],
        to: flags['--to'],
        changelogOnly: flags['--changelog-only'],
        dryRun: flags['--dry-run'],
        debug: flags['--debug'],
      })
    },
  },

  'update-template': {
    shorthands: ['ut'],
    description: `Used to update your git repo with the source template. (e.g. Takeout)`,
    flags: {
      '--help': Boolean,
      '--template-repo': String,
      '--ignored-patterns': String,
    },
    async run() {
      const { _, ...flags } = arg(this.flags)
      const { updateTemplate } = require('./update-template')
      if (!flags['--template-repo']) {
        throw new Error('--template-repo is required')
      }
      await updateTemplate(
        flags['--template-repo'],
        flags['--ignored-patterns']?.split(' ')
      )
    },
  },

  'generate-prompt': {
    shorthands: [],
    description: `Generate an LLM-friendly markdown file from your Tamagui config`,
    flags: {
      '--help': Boolean,
      '--debug': Boolean,
      '--output': String,
    },
    async run() {
      const { _, ...flags } = arg(this.flags)
      const { generatePrompt } = require('./generate-prompt')
      const options = await getOptions({
        debug: flags['--debug'] ? true : false,
        loadTamaguiOptions: true,
      })
      await generatePrompt({
        ...options,
        output: flags['--output'],
      })
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
  console.info(require('../package.json').version)
  process.exit(0)
}

if (!command && flags['--help']) {
  console.info(`$ tamagui

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
    console.info(`\n$ tamagui ${command}: ${definition.description}\n`)
    console.info(
      `Flags: ${Object.entries(definition.flags).map(([k, v]) => `${k} (${v.name})`)}`
    )
    process.exit(0)
  }

  const { _, ...cmdFlags } = arg(definition.flags)

  // help for any command
  if (cmdFlags['--help']) {
    console.info(`$ tamagui ${_}

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
    console.info(`$ ${definition}`)
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
//       console.warn(chalk.yellow(`No command found ${command}`))
//       process.exit(1)
//     }
//   }
// }
