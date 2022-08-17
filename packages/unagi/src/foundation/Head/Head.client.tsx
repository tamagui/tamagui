import React from 'react'
import { HelmetData as HeadData, HelmetProps as HeadProps, Helmet } from 'react-helmet-async'

import { useEnvContext } from '../ssrInterop.js'

const clientHeadData = new HeadData({})

export function Head({ children, ...props }: HeadProps & { children: React.ReactNode }) {
  const headData = useEnvContext((req) => req.ctx.head, clientHeadData)

  return (
    // @ts-ignore
    <Helmet {...props} helmetData={headData}>
      {children}
    </Helmet>
  )
}
