// runs once on server boot — see vite.config.ts `setupFile.server`

// RAILWAY_DEPLOYMENT_ID is only present on Railway — guards against purging
// from local prod builds
if (process.env.NODE_ENV === 'production' && process.env.RAILWAY_DEPLOYMENT_ID) {
  const { CF_API_KEY, CF_EMAIL, CF_ZONE_ID } = process.env
  if (CF_API_KEY && CF_EMAIL && CF_ZONE_ID) {
    fetch(`https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/purge_cache`, {
      method: 'POST',
      headers: {
        'X-Auth-Email': CF_EMAIL,
        'X-Auth-Key': CF_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ purge_everything: true }),
    })
      .then(async (res) => {
        const body = await res.text()
        if (!res.ok) {
          console.warn(`[cf-purge] failed ${res.status}: ${body}`)
          return
        }
        console.info('[cf-purge] cache purged on boot')
      })
      .catch((err) => console.warn('[cf-purge] error:', err))
  }
}
