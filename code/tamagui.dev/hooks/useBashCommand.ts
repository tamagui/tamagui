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

const RUN_COMMANDS = {
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
  let packageManager
  let command
  let args

  if (words[0] === 'yarn' && words[1] === 'dlx') {
    packageManager = 'yarn'
    command = 'yarn dlx'
    args = words.slice(2).join(' ')
  } else if (words[0] === 'pnpm' && words[1] === 'dlx') {
    packageManager = 'pnpm'
    command = 'pnpm dlx'
    args = words.slice(2).join(' ')
  } else {
    packageManager = words[0]
    command = words[1]
    args = words.slice(2).join(' ')
  }

  return { packageManager, command, args }
}

const isPackageManagerCommand = (text: string) => {
  const { packageManager, command } = parseCommand(text)
  return (
    PACKAGE_MANAGERS.includes(packageManager) &&
    (Object.values(INSTALL_COMMANDS).includes(command) ||
      Object.values(CREATE_COMMANDS).includes(command) ||
      isRunCommand(text))
  )
}

const isInstallCommand = (text: string) => {
  const { packageManager, command } = parseCommand(text)
  return (
    PACKAGE_MANAGERS.includes(packageManager) &&
    Object.values(INSTALL_COMMANDS).includes(command)
  )
}

const isRunCommand = (text: string) => {
  return PACKAGE_MANAGERS.some((pm) => {
    const runCmd = RUN_COMMANDS[pm as keyof typeof RUN_COMMANDS]
    return (
      text.startsWith(`${runCmd} `) || (pm === 'yarn' && text.startsWith('yarn run '))
    )
  })
}

const isCreateCommand = (text: string) => {
  const { packageManager, command } = parseCommand(text)
  return (
    PACKAGE_MANAGERS.includes(packageManager) &&
    Object.values(CREATE_COMMANDS).includes(command) &&
    !isRunCommand(text)
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

export function useBashCommand(children: ReactNode, className: string) {
  const bashText = getBashText(children).trim()
  const isBash = className === 'language-bash'

  const isPackageCommand = isBash && isPackageManagerCommand(bashText)

  const isInstall = isPackageCommand && isInstallCommand(bashText)
  const isRun = isPackageCommand && isRunCommand(bashText)
  const isCreate = isPackageCommand && isCreateCommand(bashText)
  const isTerminal = isBash && !isPackageCommand

  const showTabs = isBash && !isTerminal

  const defaultTab = 'yarn'
  const { storageItem: currentSelectedTab, setItem: setCurrentSelectedTab } =
    useLocalStorageWatcher('bashRunTab', defaultTab)

  let commandString = bashText

  if (isInstall) {
    const { args } = parseCommand(bashText)
    const installCmd = INSTALL_COMMANDS[currentSelectedTab]
    commandString = `${currentSelectedTab} ${installCmd} ${args}`
  } else if (isRun) {
    const parts = bashText.split(' ')
    const runCmd = RUN_COMMANDS[currentSelectedTab as keyof typeof RUN_COMMANDS]

    if (runCmd.includes(' dlx')) {
      // For commands like 'yarn dlx' or 'pnpm dlx'
      const [cmdPart1, cmdPart2] = runCmd.split(' ')
      const dlxIndex = parts.findIndex((part) => part === 'dlx')
      if (dlxIndex !== -1) {
        // If 'dlx' is in the original command, keep it
        const args = parts.slice(dlxIndex).join(' ')
        commandString = `${cmdPart1} ${args}`
      } else {
        // If 'dlx' is not in the original command, add it
        const args = parts.slice(1).join(' ')
        commandString = `${cmdPart1} ${cmdPart2} ${args}`
      }
    } else {
      // For commands like 'npx' or 'bunx'
      const args = parts.slice(1).join(' ')
      commandString = `${runCmd} ${args}`
    }

    // Remove any 'dlx' that appears after 'npx' or 'bunx'
    commandString = commandString.replace(/(npx|bunx)\s+dlx/, '$1')
  } else if (isCreate) {
    const { packageManager, args } = parseCommand(bashText)
    const createCmd = CREATE_COMMANDS[currentSelectedTab]
    // Always use the currentSelectedTab (which is 'yarn' by default) for create commands
    commandString = `${currentSelectedTab} ${createCmd} ${args}`
  }

  const getCode = (code: string) => {
    if (isBash) {
      if (isTerminal) {
        return code.trim()
      }
      return commandString.trim()
    }
    return code.trim()
  }

  return {
    isTerminal,
    isStarter: isCreate,
    isPackageRunner: isRun,
    isCreate,
    isInstall,
    isRun,
    showTabs,
    command: commandString,
    getCode,
    currentSelectedTab,
    setCurrentSelectedTab,
  }
}
