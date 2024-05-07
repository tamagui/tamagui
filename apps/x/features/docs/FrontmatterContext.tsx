import React from 'react'

import type { Frontmatter } from '~/features/mdx/types'

export const FrontmatterContext = React.createContext<Frontmatter>({} as any)
