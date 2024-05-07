import { apiRoute } from '~/features/api/apiRoute'
import schema from './schema.json'

export default apiRoute((req) => {
  return Response.json(schema)
})
