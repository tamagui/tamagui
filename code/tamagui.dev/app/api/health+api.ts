// health check endpoint for railway deployment verification
export default async function GET() {
  return Response.json({ status: 'ok' }, { status: 200 })
}
