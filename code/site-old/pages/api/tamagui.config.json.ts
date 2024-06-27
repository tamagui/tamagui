import { apiRoute } from '@lib/apiRoute'
import { readFile } from 'fs/promises'
import { join } from 'path'

const handler = apiRoute(async (req, res) => {
  const defaultConfigFile = await readFile(
    join(process.cwd(), '.tamagui', 'tamagui.config.json'),
    'utf-8'
  )

  const config = JSON.parse(defaultConfigFile.toString())
  res.json(config)
})

export default handler
