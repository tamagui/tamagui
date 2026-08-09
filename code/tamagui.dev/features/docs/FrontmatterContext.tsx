import type { Frontmatter } from '@vxrn/mdx-rust'
import React from 'react'

export const FrontmatterContext = React.createContext<Frontmatter>({} as any)
