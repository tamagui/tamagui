import React from 'react'

import { FrontmatterContext } from './FrontmatterContext'

// Custom provider for next-mdx-remote
// https://github.com/hashicorp/next-mdx-remote#using-providers

export function MDXProvider(props) {
  const { frontmatter, children } = props
  return (
    <>
      <FrontmatterContext.Provider value={frontmatter}>
        {children}
      </FrontmatterContext.Provider>
    </>
  )
}
