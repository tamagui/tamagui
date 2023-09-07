import { TamaguiProvider } from '@tamagui/core'
import { ExpoRoot } from '@tamagui/expo-router'
import { useEffect, useState } from 'react'

import { default as config } from './tamagui.config'

// @ts-ignore
const modules = import.meta.glob('../app/**/*.tsx')

export function App() {
  const context = useExpoContext(modules)

  if (!context) {
    return null
  }

  return (
    <TamaguiProvider config={config}>
      <ExpoRoot context={context} />
    </TamaguiProvider>
  )
}

// for some reason putting it in state doesnt even re-render
let ctx
function useExpoContext(modules: any) {
  const [_, setState] = useState(0)

  useEffect(() => {
    async function run() {
      // make it look like webpack context
      const modulesSync = {}
      await Promise.all(
        Object.keys(modules).map(async (path) => {
          modulesSync[path.replace('../app/', './')] = await modules[path]()
        })
      )
      const moduleKeys = Object.keys(modulesSync)
      function next(id: string) {
        return modulesSync[id]
      }
      next.keys = () => moduleKeys
      next.id = ''
      next.resolve = (id: string) => id
      ctx = next
      setState(Math.random())
    }

    run()
  }, [])

  return ctx
}
