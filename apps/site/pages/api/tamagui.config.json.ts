import { readFileSync } from 'fs'
import { join } from 'path'

import { NextApiHandler } from 'next'

const handler: NextApiHandler = async (req, res) => {
  const defaultConfigFile = readFileSync(
    join(process.cwd(), 'public', 'default-tamagui.config.json')
  )

  const config = JSON.parse(defaultConfigFile.toString())
  console.log(config)
  res.json(config)
}

export default handler
