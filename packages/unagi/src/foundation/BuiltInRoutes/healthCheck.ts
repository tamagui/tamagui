export async function HealthCheck() {
  return new Response(null, { status: 200 })
}
