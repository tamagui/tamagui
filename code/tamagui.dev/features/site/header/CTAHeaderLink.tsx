import type { Href } from 'one'
import type * as React from 'react'
import { Link } from '../../../components/Link'
import { HeadAnchor } from './HeaderLinks'
import type { HeaderProps } from './types'

export const CTAHeaderLink = ({
  href,
  icon,
  name,
  excludeRoutes,
  description,
  forceShowAllLinks,
}: HeaderProps & {
  href: Href
  icon: React.ReactNode
  name: string
  description: string
  excludeRoutes?: string[]
}) => {
  // disabling for now it clutters things
  return (
    <Link asChild href={href}>
      <HeadAnchor
        grid={forceShowAllLinks}
        fontSize={24}
        mx={-2}
        $sm={{
          display: 'none',
        }}
      >
        {icon}
      </HeadAnchor>
    </Link>
  )
}
