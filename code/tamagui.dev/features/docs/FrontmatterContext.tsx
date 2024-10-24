import type { Frontmatter } from '@tamagui/mdx-2'
import React from 'react'

export const FrontmatterContext = React.createContext<Frontmatter>({} as any)
