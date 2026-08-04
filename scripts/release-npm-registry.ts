type RegistryFetch = typeof fetch

export function createNpmRegistryClient(
  registry: string,
  registryFetch: RegistryFetch = fetch
) {
  const registryUrl = registry.endsWith('/') ? registry : `${registry}/`
  const distTagsByPackage = new Map<string, Promise<Record<string, string> | null>>()

  const request = async (pathname: string) => {
    const response = await registryFetch(new URL(pathname, registryUrl), {
      cache: 'no-store',
      headers: {
        accept: 'application/json',
        'cache-control': 'no-cache',
      },
    })

    if (response.status === 404) {
      return null
    }

    if (!response.ok) {
      const body = (await response.text()).slice(0, 500)
      throw new Error(
        `npm registry request failed (${response.status} ${response.statusText}): ${body}`
      )
    }

    return response
  }

  return {
    async hasVersion(name: string, version: string) {
      const response = await request(
        `${encodeURIComponent(name)}/${encodeURIComponent(version)}`
      )
      if (!response) {
        return false
      }

      const manifest = (await response.json()) as { version?: string }
      return manifest.version === version
    },

    async getDistTag(name: string, tag: string) {
      let tagsRequest = distTagsByPackage.get(name)
      if (!tagsRequest) {
        tagsRequest = request(`-/package/${encodeURIComponent(name)}/dist-tags`).then(
          async (response) =>
            response ? ((await response.json()) as Record<string, string>) : null
        )
        distTagsByPackage.set(name, tagsRequest)
      }

      return (await tagsRequest)?.[tag] || null
    },
  }
}
