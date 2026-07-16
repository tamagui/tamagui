import arg from 'arg'
import chalk from 'chalk'

import { disposeAll, getOptions } from './utils'

process.on('exit', disposeAll)

const COMMAND_MAP = {
  check: {
    description: `Checks for inconsistent versions, duplicate installs, lockfile issues, and missing config.`,
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
      })
      const { checkDeps } = require('@tamagui/static/checkDeps')
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
      const { loadTamagui } = require('@tamagui/static/loadTamagui')
      process.env.TAMAGUI_KEEP_THEMES = '1'
      await loadTamagui({
        ...options.tamaguiOptions,
        platform: 'web',
      })

      // also generate prompt to .tamagui/prompt.md
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

      const { loadTamagui } = require('@tamagui/static/loadTamagui')
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
    description: `Use to add fonts and icons to your monorepo.`,
    flags: {
      '--help': Boolean,
      '--debug': Boolean,
      '--verbose': Boolean,
    },
    async run() {
      const { _, ...flags } = arg(this.flags)
      const { installGeneratedPackage } = require('./add')
      const [cmd, type, path] = _
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
      '--output-around': Boolean,
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
        outputAround: flags['--output-around'],
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

  migrate: {
    shorthands: [],
    description: `Print an AI-agent prompt for migrating a Tamagui app to v3`,
    usage: `$ tamagui migrate --from v2
$ tamagui migrate --from v1`,
    flags: {
      '--help': Boolean,
      '--from': String,
    },
    async run() {
      const { _, ...flags } = arg(this.flags)
      const [_cmd, fromArg] = _
      const { printMigrationPrompt } = require('./migrate')

      printMigrationPrompt({
        from: flags['--from'] || fromArg,
      })
    },
  },

  'to-tailwind': {
    shorthands: [],
    description: `Convert Tamagui JSX props in files or globs to Tailwind className syntax`,
    flags: {
      '--help': Boolean,
      '--write': Boolean,
      // path to the app's tamagui config so token/media/shorthand resolution uses the app's
      // ACTUAL scales, not the bundled default fallback.
      '--config': String,
      // acknowledge use of the bundled default scales (required for --write without --config).
      '--use-default-config': Boolean,
      // opt in to DOM renaming (View→div). default: preserve Tamagui components (RN-safe).
      '--rename-dom': Boolean,
    },
    async run() {
      const { _, ...flags } = arg(this.flags)
      const { toTailwind } = require('./to-tailwind')
      const [_cmd, ...patterns] = _

      await toTailwind({
        patterns,
        write: flags['--write'],
        configPath: flags['--config'],
        useDefaultConfig: flags['--use-default-config'],
        renameDom: flags['--rename-dom'],
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
    if ('usage' in definition && definition.usage) {
      console.info(`Usage:\n${definition.usage}\n`)
    }
    console.info(
      `Flags:\n${Object.entries(definition.flags)
        .map(([k, v]) => `  ${k} (${v.name})`)
        .join('\n')}`
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
    process.exit(1) // a thrown command error must be a NON-ZERO exit (safety: --write aborts)
  }

  process.exit(0)
}
