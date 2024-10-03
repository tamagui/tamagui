import { type ReactNode, isValidElement } from 'react'
import { useLocalStorageWatcher } from './useLocalStorageWatcher'

export const PACKAGE_MANAGERS = ['yarn', 'npm', 'bun', 'pnpm']

export const pkgCommands = PACKAGE_MANAGERS.reduce(
  (acc, pkg) => {
    acc[pkg] = pkg
    return acc
  },
  {} as Record<(typeof PACKAGE_MANAGERS)[number], (typeof PACKAGE_MANAGERS)[number]>
)

const EXEC_COMMANDS = {
  npm: 'npx',
  yarn: 'yarn dlx',
  bun: 'bunx',
  pnpm: 'pnpm dlx',
}

const INSTALL_COMMANDS = {
  npm: 'install',
  yarn: 'add',
  bun: 'add',
  pnpm: 'install',
}

const CREATE_COMMANDS = {
  npm: 'create',
  yarn: 'create',
  bun: 'create',
  pnpm: 'create',
}

const SCRIPT_COMMANDS = {
  npm: 'run',
  yarn: '',
  bun: 'run',
  pnpm: '',
}

const parseCommand = (text: string) => {
  const words = text.trim().split(' ')
  let packageManager = ''
  let command = ''
  let args = ''

  // Check for exec commands first
  for (const [pm, execCmd] of Object.entries(EXEC_COMMANDS)) {
    const execCmdParts = execCmd.split(' ')
    if (
      words[0] === execCmdParts[0] &&
      (execCmdParts.length === 1 ||
        words.slice(0, execCmdParts.length).join(' ') === execCmd)
    ) {
      packageManager = pm
      command = execCmd
      args = words.slice(execCmdParts.length).join(' ')
      return { packageManager, command, args }
    }
  }

  // If no exec command was found, proceed with the existing logic
  packageManager = words[0]
  command = words[1]
  args = words.slice(2).join(' ')

  // Special case for 'install' command without arguments
  if (command === 'install' && args === '') {
    return { packageManager, command: 'install', args: '' }
  }

  return { packageManager, command, args }
}

export const stringIsScriptCommand = (text: string) => {
  const { packageManager, command } = parseCommand(text)
  if (!PACKAGE_MANAGERS.includes(packageManager)) return false

  const scriptCmd = SCRIPT_COMMANDS[packageManager as keyof typeof SCRIPT_COMMANDS]
  if (scriptCmd === '') {
    // For package managers like yarn and pnpm that don't require 'run'
    return (
      command !== 'add' &&
      command !== 'install' &&
      command !== 'create' &&
      !stringIsExecCommand(text)
    )
  }
  // For package managers like npm and bun that require 'run'
  return command === 'run'
}

const isPackageManagerCommand = (text: string) => {
  const { packageManager, command } = parseCommand(text)
  return (
    PACKAGE_MANAGERS.includes(packageManager) &&
    (Object.values(INSTALL_COMMANDS).includes(command) ||
      Object.values(CREATE_COMMANDS).includes(command) ||
      Object.values(EXEC_COMMANDS).includes(command) ||
      stringIsExecCommand(text) ||
      stringIsScriptCommand(text))
  )
}

const stringIsInstallCommand = (text: string) => {
  const { packageManager, command } = parseCommand(text)
  return (
    PACKAGE_MANAGERS.includes(packageManager) &&
    Object.values(INSTALL_COMMANDS).includes(command)
  )
}

export const stringIsExecCommand = (text: string) => {
  return PACKAGE_MANAGERS.some((pm) => {
    const execCmd = EXEC_COMMANDS[pm as keyof typeof EXEC_COMMANDS]
    const execCmdParts = execCmd.split(' ')
    // Check if the command starts with the exec command
    return (
      text.trim().startsWith(execCmdParts[0]) &&
      (execCmdParts.length === 1 || text.trim().startsWith(execCmd))
    )
  })
}

export const stringIsCreateCommand = (text: string) => {
  const { packageManager, command } = parseCommand(text)
  return (
    PACKAGE_MANAGERS.includes(packageManager) &&
    Object.values(CREATE_COMMANDS).includes(command) &&
    !stringIsExecCommand(text) // Ensure it's not a run command
  )
}

function getBashText(children: ReactNode): string {
  const extractText = (node: ReactNode): string => {
    if (typeof node === 'string') return node
    if (Array.isArray(node)) return node.map(extractText).join('')
    if (isValidElement(node)) {
      return extractText(node.props.children)
    }
    return ''
  }
  return extractText(children)
}

type UseBashCommandOutputs = {
  isTerminalCommand: boolean
  isCreateCommand: boolean
  isInstallCommand: boolean
  isExecCommand: boolean
  isScriptCommand: boolean
  showTabs: boolean
  commandType: string
  transformedCommand: string
  selectedPackageManager: (typeof PACKAGE_MANAGERS)[number]
  originalPackageManager: (typeof PACKAGE_MANAGERS)[number]
  setPackageManager: (value: (typeof PACKAGE_MANAGERS)[number]) => void
}

export function useBashCommand(
  node: ReactNode,
  className: String = 'language-bash'
): UseBashCommandOutputs {
  const bashText = getBashText(node).trim()
  const isBash = className === 'language-bash'

  const isPackageCommand = isBash && isPackageManagerCommand(bashText)

  const {
    packageManager: originalPackageManager,
    command: commandType,
    args,
  } = parseCommand(bashText)

  const isInstallCommand = isPackageCommand && stringIsInstallCommand(bashText)
  const isExecCommand = isPackageCommand && stringIsExecCommand(bashText)
  const isCreateCommand = isPackageCommand && stringIsCreateCommand(bashText)
  const isScriptCommand = isPackageCommand && stringIsScriptCommand(bashText)
  const isTerminalCommand = isBash && !isPackageCommand

  const showTabs = isBash && !isTerminalCommand

  const defaultTab = 'yarn'
  const { storageItem: selectedPackageManager, setItem: setPackageManager } =
    useLocalStorageWatcher('bashRunTab', defaultTab)

  const transformCommand = (inputCommand: string): string => {
    if (!isBash) return inputCommand.trim()
    if (isTerminalCommand) return inputCommand.trim()

    const commands = inputCommand.split('&&').map((cmd) => cmd.trim())
    const transformedCommands = commands.map((cmd) => {
      const { packageManager, command, args } = parseCommand(cmd)

      if (stringIsInstallCommand(cmd)) {
        // Special case for 'install' command without arguments
        if (command === 'install' && args === '') {
          return `${selectedPackageManager} install`.trim()
        }
        const installCmd = INSTALL_COMMANDS[selectedPackageManager]
        return `${selectedPackageManager} ${installCmd} ${args}`.trim()
      }

      if (stringIsCreateCommand(cmd)) {
        const createCmd = CREATE_COMMANDS[selectedPackageManager]
        return `${selectedPackageManager} ${createCmd} ${args}`.trim()
      }

      if (stringIsExecCommand(cmd)) {
        const runCmd = EXEC_COMMANDS[selectedPackageManager as keyof typeof EXEC_COMMANDS]
        return `${runCmd} ${args}`.trim()
      }

      if (stringIsScriptCommand(cmd)) {
        const scriptCmd =
          SCRIPT_COMMANDS[selectedPackageManager as keyof typeof SCRIPT_COMMANDS]
        const scriptName = args || command // Use 'args' if available, otherwise use 'command'
        return `${selectedPackageManager}${scriptCmd ? ' ' + scriptCmd : ''} ${scriptName}`.trim()
      }

      return cmd
    })

    return transformedCommands.join(' && ')
  }

  const transformedCommand = transformCommand(bashText)

  return {
    isTerminalCommand,
    isCreateCommand,
    isInstallCommand,
    isExecCommand,
    isScriptCommand,
    showTabs,
    commandType,
    transformedCommand,
    originalPackageManager,
    selectedPackageManager,
    setPackageManager,
  }
}
