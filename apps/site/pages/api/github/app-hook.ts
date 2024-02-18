import { apiRoute } from '@lib/apiRoute'

const handler = apiRoute(async (req, res) => {
  console.info(req.query, req.body, req.headers['x-hub-signature'], req.headers)

  switch (req.body.action) {
  }

  res.json({
    success: true,
  })
})

export default handler
