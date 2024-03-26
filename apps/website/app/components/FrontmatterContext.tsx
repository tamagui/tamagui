import React from 'react'

import type { Frontmatter } from '../frontmatter'

export const FrontmatterContext = React.createContext<Frontmatter>({} as any)
