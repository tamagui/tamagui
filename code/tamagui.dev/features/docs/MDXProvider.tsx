import { FrontmatterContext } from './FrontmatterContext'

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
