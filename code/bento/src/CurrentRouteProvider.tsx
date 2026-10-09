import { createContext, useContext, useMemo } from 'react'

const Context = createContext({
  part: '',
  section: '',
})

export const CurrentRouteProvider = ({
  section,
  part,
  children,
}: {
  part: string
  section: string
  children: any
}) => {
  const value = useMemo(
    () => ({
      part,
      section,
    }),
    [section, part]
  )

  return <Context.Provider value={value}>{children}</Context.Provider>
}

export const useCurrentRouteParams = () => {
  return useContext(Context)
}
