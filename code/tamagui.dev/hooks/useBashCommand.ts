import type { ReactNode } from 'react'
import { Children, isValidElement } from 'react'
import { useLocalStorageWatcher } from './useLocalStorageWatcher'

export const pkgCommands = {
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

const startsWithCommand = (text: string, commandList: Record<string, string>) =>
  Object.values(commandList).some((command) => text?.startsWith(command))

const getPackageToInstall = (text: string) => text?.split(' ').splice(2).join(' ')
const getPackageToRun = (text: string) => text?.split(' ').splice(1).join(' ')

export function useBashCommand(children: ReactNode, className: string) {
  const bashText = getBashText(children)

  const isBash = className === 'language-bash'
  const isPackage = startsWithCommand(bashText, pkgCommands)
  const isPackageRunner = startsWithCommand(bashText, pkgRunCommands)

  const isStarter = bashText?.startsWith('npm create')
  const isTerminal = isBash && !isPackage && !isPackageRunner && !isStarter

  const packageToInstall = getPackageToInstall(bashText)
  const packageToRun = getPackageToRun(bashText)

  const showTabs = isBash && !isTerminal

  const { storageItem: currentSelectedTab, setItem: setCurrentSelectedTab } =
    useLocalStorageWatcher(
      isPackageRunner ? 'bashPkgRunTab' : 'bashPkgInstallTab',
      isStarter ? 'npm' : isPackageRunner ? 'npx' : 'yarn'
    )

  const command = isStarter
    ? bashText
    : `${commands[currentSelectedTab]} ${isPackage ? packageToInstall : packageToRun}`

  const getCode = (code: string) => {
    if (isBash) {
      if (isTerminal || isStarter) {
        return code.trim()
      }
      return command.trim()
    }
    return code.trim()
  }

  return {
    isTerminal,
    isStarter,
    isPackageRunner,
    showTabs,
    command,
    getCode,
    currentSelectedTab,
    setCurrentSelectedTab,
  }
}

export function getBashText(children: any): any {
  return `${Children.toArray(children)
    .flatMap((x) => {
      if (typeof x === 'string') return x
      if (isValidElement(x)) {
        return x?.props?.children ? getBashText(x.props.children) : x
      }
      return ''
    })
    .join('')}`
}
