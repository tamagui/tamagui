// This file is modified by Vite at build time
// with user project information and re-exports it.

// @ts-ignore
import appEntry from '__UNAGI_ENTRY__'

import type { RequestHandler } from '../shared-types.js'

export const handleRequest = appEntry as RequestHandler

export { default as indexTemplate } from '__UNAGI_HTML_TEMPLATE__?raw'

export const assets = new Set(['__UNAGI_ASSETS__']) as Set<string>
export const assetPrefix = '/__UNAGI_ASSETS_DIR__/' as string

export const isAsset = (pathname = '') => pathname.startsWith(assetPrefix) || assets.has(pathname)

export const relativeClientBuildPath = '__UNAGI_RELATIVE_CLIENT_BUILD__' as string

export const assetBasePath = '__UNAGI_ASSETS_BASE_URL__' as string

throw new Error('This file must be overwritten in a Vite plugin')
