import whyDidYouRender from '@welldone-software/why-did-you-render'
import React from 'react'

if (process.env.NODE_ENV === 'development') {
  whyDidYouRender(React, {
    include: [/.*/],
    collapseGroups: true,
    logOnDifferentValues: true,
    trackAllPureComponents: true,
    trackHooks: true,
  })
}
