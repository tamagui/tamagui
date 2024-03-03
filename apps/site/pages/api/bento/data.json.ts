import type { NextApiHandler } from 'next'

// this endpoint is mainly used for taking screenshots of the bento components
const handler: NextApiHandler = async (req, res) => {
  // @ts-ignore we use a combination of require + ts-ignore to make TS not try to resolve all the imports on @tamagui/bento
  const listingData = await require('@tamagui/bento/src/sections').then(
    (mod) => mod['listingData']
  )
  res.json(
    await Promise.all(
      listingData.sections.map(async (section) => ({
        ...section,
        parts: await Promise.all(
          section.parts.map(async (part) => {
            const componentNames = Object.keys(
              await import(
                /* webpackExclude: /\.native\.tsx$/ */
                `@tamagui/bento/src/components${part.route}`
              )
            )
            return {
              ...part,
              components: componentNames,
            }
          })
        ),
      }))
    )
  )
}

export default handler
