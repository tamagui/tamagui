import type { Frontmatter } from '@tamagui/mdx'
import React from 'react'

export const FrontmatterContext = React.createContext<Frontmatter>({} as any)
