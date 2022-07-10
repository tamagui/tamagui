import React from 'react'

// backwards compat
export const startTransition = React.startTransition || ((cb) => cb())
