import { apiRoute } from '~/features/api/apiRoute'
import { getQuery } from '~/features/api/getQuery'

export default apiRoute(async (req) => {
  const query = getQuery(req)

  console.info(query, req.body, req.headers['x-hub-signature'], req.headers)

  return Response.json({
    success: true,
  })
})
