import { apiRoute } from '@lib/apiRoute'

const handler = apiRoute((req, res) => {
  res.json(require('./schema.json'))
})

export default handler
