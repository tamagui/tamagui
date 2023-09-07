import { useEffect, useState } from 'react'

let ctx

// for some reason putting it in state doesnt even re-render
export function useExpoContext(modules: any) {
  const [_, setState] = useState(0)

  globalThis['__importMetaGlobbed'] = modules

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
