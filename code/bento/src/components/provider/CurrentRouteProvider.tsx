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
  return (
    <Context.Provider
      value={useMemo(
        () => ({
          part,
          section,
        }),
        [section, part]
      )}
    >
      {children}
    </Context.Provider>
  )
}

export const useCurrentRouteParams = () => {
  return useContext(Context)
}
