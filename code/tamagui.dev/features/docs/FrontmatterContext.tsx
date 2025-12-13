import type { Frontmatter } from '@vxrn/mdx'
import React from 'react'

export const FrontmatterContext = React.createContext<Frontmatter>({} as any)
