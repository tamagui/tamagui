import { describe, expect, test } from 'bun:test'

import { createNpmRegistryClient } from './release-npm-registry'

describe('npm registry release reads', () => {
  test('checks a scoped package version through the registry HTTP API', async () => {
    const requests: string[] = []
    const registry = createNpmRegistryClient('https://registry.example.test', (async (
      input
    ) => {
      requests.push(String(input))
      return Response.json({ name: '@tamagui/core', version: '2.6.3' })
    }) as typeof fetch)

    expect(await registry.hasVersion('@tamagui/core', '2.6.3')).toBe(true)
    expect(requests).toEqual(['https://registry.example.test/%40tamagui%2Fcore/2.6.3'])
  })

  test('returns false for an unpublished version', async () => {
    const registry = createNpmRegistryClient(
      'https://registry.example.test/',
      (async () => new Response('not found', { status: 404 })) as typeof fetch
    )

    expect(await registry.hasVersion('tamagui', '9.9.9')).toBe(false)
  })

  test('reads dist-tags without loading the package metadata document', async () => {
    const requests: string[] = []
    const registry = createNpmRegistryClient('https://registry.example.test/', (async (
      input
    ) => {
      requests.push(String(input))
      return Response.json({ latest: '2.6.3', beta: '3.0.0-beta.4' })
    }) as typeof fetch)

    expect(await registry.getDistTag('@tamagui/core', 'beta')).toBe('3.0.0-beta.4')
    expect(await registry.getDistTag('@tamagui/core', 'latest')).toBe('2.6.3')
    expect(requests).toEqual([
      'https://registry.example.test/-/package/%40tamagui%2Fcore/dist-tags',
    ])
  })

  test('reports registry failures instead of treating them as unpublished', async () => {
    const registry = createNpmRegistryClient(
      'https://registry.example.test/',
      (async () =>
        new Response('temporarily unavailable', {
          status: 503,
          statusText: 'Service Unavailable',
        })) as typeof fetch
    )

    await expect(registry.hasVersion('tamagui', '2.6.3')).rejects.toThrow(
      '503 Service Unavailable'
    )
  })
})
