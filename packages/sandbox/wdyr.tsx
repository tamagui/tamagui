import React from 'react'

if (process.env.NODE_ENV === 'development') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render')
  console.log('tracking')
  whyDidYouRender(React, {
    trackAllPureComponents: true,
    trackHooks: true,
    includes: [/.*/],
  })
}
