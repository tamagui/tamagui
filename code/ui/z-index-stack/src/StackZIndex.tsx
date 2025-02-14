import { useContext } from 'react'
import { ZIndexStackContext } from './context'

export const StackZIndex = (props: { children: React.ReactNode }) => {
  const existing = useContext(ZIndexStackContext)

  return (
    <ZIndexStackContext.Provider value={existing + 1}>
      {props.children}
    </ZIndexStackContext.Provider>
  )
}
