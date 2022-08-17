import React, { FC, ReactNode, createContext, useContext } from 'react'

type RouteParamsContextValue = {
  routeParams: Record<string, string>
  basePath: string
}

export const RouteParamsContext = createContext<RouteParamsContextValue>({
  routeParams: {},
  basePath: '/',
})

export const RouteParamsProvider: FC<{
  routeParams: Record<string, string>
  basePath: string
  children: ReactNode
}> = ({ children, routeParams, basePath }) => {
  return (
    <RouteParamsContext.Provider value={{ routeParams, basePath }}>
      {children}
    </RouteParamsContext.Provider>
  )
}

export function useBasePath() {
  const router = useContext(RouteParamsContext)
  return router.basePath
}
