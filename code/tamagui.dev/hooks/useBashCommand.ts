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

  return { packageManager, command, args }
}

const isPackageManagerCommand = (text: string) => {
  const { packageManager, command } = parseCommand(text)
  return (
    PACKAGE_MANAGERS.includes(packageManager) &&
    (Object.values(INSTALL_COMMANDS).includes(command) ||
      Object.values(CREATE_COMMANDS).includes(command) ||
      Object.values(EXEC_COMMANDS).includes(command) ||
      stringIsExecCommand(text))
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

  const isInstallCommand = isPackageCommand && stringIsInstallCommand(bashText)
  const isExecCommand = isPackageCommand && stringIsExecCommand(bashText)
  const isCreateCommand = isPackageCommand && stringIsCreateCommand(bashText)
  const isTerminalCommand = isBash && !isPackageCommand

  const showTabs = isBash && !isTerminalCommand

  const defaultTab = 'yarn'
  const { storageItem: selectedPackageManager, setItem: setPackageManager } =
    useLocalStorageWatcher('bashRunTab', defaultTab)

  const {
    packageManager: originalPackageManager,
    command: commandType,
    args,
  } = parseCommand(bashText)

  const transformCommand = (inputCommand: string): string => {
    if (!isBash) return inputCommand.trim()
    if (isTerminalCommand) return inputCommand.trim()

    if (isInstallCommand) {
      const installCmd = INSTALL_COMMANDS[selectedPackageManager]
      return `${selectedPackageManager} ${installCmd} ${args}`.trim()
    }

    if (isCreateCommand) {
      const createCmd = CREATE_COMMANDS[selectedPackageManager]
      return `${selectedPackageManager} ${createCmd} ${args}`.trim()
    }

    if (isExecCommand) {
      const runCmd = EXEC_COMMANDS[selectedPackageManager as keyof typeof EXEC_COMMANDS]

      if (Object.values(EXEC_COMMANDS).some((cmd) => inputCommand.startsWith(cmd))) {
        return `${runCmd} ${args}`.trim()
      }
      return `${selectedPackageManager} ${commandType} ${args}`.trim()
    }

    return inputCommand.trim()
  }

  const transformedCommand = transformCommand(bashText)

  return {
    isTerminalCommand,
    isCreateCommand,
    isInstallCommand,
    isExecCommand,
    showTabs,
    commandType,
    transformedCommand,
    originalPackageManager,
    selectedPackageManager,
    setPackageManager,
  }
}
