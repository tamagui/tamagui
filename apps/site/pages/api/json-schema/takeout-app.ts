import { NextApiHandler } from 'next'

const handler: NextApiHandler = (req, res) => {
  res.json(require('./schema.json'))
}

export default handler
