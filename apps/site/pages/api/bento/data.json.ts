import type { NextApiHandler } from 'next'
import { listingData } from '@tamagui/bento/src/sections'

// this endpoint is mainly used for taking screenshots of the bento components
const handler: NextApiHandler = async (req, res) => {
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
