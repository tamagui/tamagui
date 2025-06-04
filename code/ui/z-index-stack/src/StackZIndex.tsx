import { useContext } from 'react'
import { ZIndexHardcodedContext, ZIndexStackContext } from './context'

export const StackZIndexContext = ({
  children,
  zIndex,
}: { children: React.ReactNode; zIndex?: number }) => {
  const existing = useContext(ZIndexStackContext)

  let content = (
    <ZIndexStackContext.Provider value={existing + 1}>
      {children}
    </ZIndexStackContext.Provider>
  )

  if (typeof zIndex !== 'undefined') {
    content = (
      <ZIndexHardcodedContext.Provider value={zIndex}>
        {content}
      </ZIndexHardcodedContext.Provider>
    )
  }

  return content
}
