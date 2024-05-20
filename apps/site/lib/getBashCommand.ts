import { getBashText } from '@components/getBashText'
import { useEffect, useState } from 'react'

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

const commands = {
  yarn: 'yarn add',
  bun: 'bun add',
  npm: 'npm install',
  pnpm: 'pnpm install',
  npx: 'npx',
  bunx: 'bunx',
}

const startsWithCommand = (text, commandList) =>
  Object.values(commandList).some((command) => text?.startsWith(command))

const getPackageToInstall = (text) => text?.split(' ').splice(2).join(' ')
const getPackageToRun = (text) => text?.split(' ').splice(1).join(' ')

export function getBashCommand(children, className) {
  const bashText = getBashText(children)[0]

  const isBash = className === 'language-bash'
  const isPackage = startsWithCommand(bashText, pkgCommands)
  const isPackageRunner = startsWithCommand(bashText, pkgRunCommands)

  const isStarter = bashText?.startsWith('npm create')
  const isTerminal = isBash && !isPackage && !isPackageRunner && !isStarter

  const packageToInstall = getPackageToInstall(bashText)
  const packageToRun = getPackageToRun(bashText)

  const [command, setCommand] = useState(
    isStarter ? bashText : isPackage ? `yarn ${packageToInstall}` : `npx ${packageToRun}`
  )

  const showTabs = isBash && !isTerminal

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

  const getTabKey = () => {
    if (isStarter) return 'bashPkgStartTab'
    if (isPackageRunner) return 'bashPkgRunTab'
    return 'bashPkgInstallTab'
  }

  const storedTab =
    typeof window !== 'undefined' ? localStorage.getItem(getTabKey()) : null

  const defaultTab = isStarter ? 'npm' : isPackageRunner ? 'npx' : 'yarn'

  useEffect(() => {
    setCommand(
      isStarter
        ? bashText
        : `${commands[storedTab ?? defaultTab]} ${
            isPackage ? packageToInstall : packageToRun
          }`
    )
  }, [storedTab])

  return {
    isTerminal,
    isStarter,
    isPackageRunner,
    showTabs,
    defaultTab,
    getTabKey,
    command,
    getCode,
    handleTabChange,
  }
}
