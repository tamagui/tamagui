import NextInternalLink from 'next/link'
import * as React from 'react'

export const NextLink = React.forwardRef((props, ref) => {
  return (
    <NextInternalLink
      ref={ref}
      legacyBehavior
      {...props}
      className={`next-link ` + (props.className || '')}
    />
  )
}) as typeof NextInternalLink
