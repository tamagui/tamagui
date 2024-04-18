import { getBashText } from '@components/getBashText'
import { useState } from 'react'

export function getBashCommand(children, className) {
  const bashText = getBashText(children)[0]

  const pkgCommands = {
    yarn: 'yarn',
    bun: 'bun',
    npm: 'npm',
    pnpm: 'pnpm',
  }

  const pkgRunCommands = {
    npx: 'npx',
    bunx: 'bunx',
  }

  const isBash = className === 'language-bash'
  const isPackage = Object.values(pkgCommands).some((command) =>
    bashText.startsWith(command)
  )
  const isPackageRunner = Object.values(pkgRunCommands).some((command) =>
    bashText.startsWith(command)
  )

  const isStarter = bashText.startsWith('npm create')
  const isTerminal = isBash && !isPackage && !isPackageRunner && !isStarter

  const packageToInstall = bashText.split(' ').splice(2).join(' ')
  const packageToRun = bashText.split(' ').splice(1).join(' ')

  const [command, setCommand] = useState(
    isStarter ? bashText : isPackage ? `yarn ${packageToInstall}` : `npx ${packageToRun}`
  )

  const showTabs = isBash && !isTerminal

  const commands = {
    yarn: 'yarn add',
    bun: 'bun add',
    npm: 'npm install',
    pnpm: 'pnpm install',
    npx: 'npx',
    bunx: 'bunx',
  }

  const handleTabChange = (tab: string) => {
    setCommand(
      isStarter
        ? bashText
        : `${commands[tab]} ${isPackage ? packageToInstall : packageToRun}`
    )
  }

  const getCode = (code: string) => {
    if (isBash) {
      if (isTerminal || isStarter) {
        return code
      }
      return command
    }
    return code
  }

  return {
    isTerminal,
    isStarter,
    isPackageRunner,
    showTabs,
    command,
    getCode,
    handleTabChange,
  }
}
