import { apiRoute } from '~/features/api/apiRoute'

export default apiRoute(async (req) => {
  console.info(req.query, req.body, req.headers['x-hub-signature'], req.headers)

  switch (req.body.action) {
  }

  return Response.json({
    success: true,
  })
})
