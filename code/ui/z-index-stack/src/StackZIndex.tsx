import { useContext } from 'react'
import { ZIndexStackContext } from './context'

export const StackZIndexContext = (props: { children: React.ReactNode }) => {
  const existing = useContext(ZIndexStackContext)

  console.log('stacking', existing)

  return (
    <ZIndexStackContext.Provider value={existing + 1}>
      {props.children}
    </ZIndexStackContext.Provider>
  )
}
