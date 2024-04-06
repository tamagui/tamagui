import type { LinkProps } from '@remix-run/react'
import { Link as RemixLink } from '@remix-run/react'

export const Link = (props: LinkProps) => {
  return <RemixLink {...props} />
}
