import whyDidYouRender from '@welldone-software/why-did-you-render'
import React from 'react'

if (process.env.NODE_ENV === 'development') {
  console.log('tracking')
  whyDidYouRender(React, {
    trackAllPureComponents: true,
    trackHooks: true,
  })
}
