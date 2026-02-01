// helper for SEO/social meta attributes

import { Fragment } from 'react'

const SITE_URL = process.env.ONE_SERVER_URL || 'https://tamagui.dev'

const DEFAULT_OG_IMAGE = '/social.png'

export function HeadInfo({
  title,
  description,
  openGraph,
}: {
  title?: string
  description?: string
  openGraph?: {
    type?: string
    locale?: string
    url?: string
    siteName?: string
    images?: { url: string; width?: number; height?: number }[]
  }
}) {
  const fullTitle = title?.includes('Tamagui') ? title : `${title} | Tamagui`

  // use provided images or fall back to default
  const images = openGraph?.images ?? [{ url: DEFAULT_OG_IMAGE }]

  return (
    <>
      {title && (
        <>
          <title>{fullTitle}</title>
          <meta property="og:title" content={fullTitle} />
        </>
      )}

      {description && (
        <>
          <meta name="description" content={description} />
          <meta property="og:description" content={description} />
        </>
      )}

      {openGraph?.url && (
        <>
          <meta
            property="og:url"
            content={
              openGraph.url.startsWith('http')
                ? openGraph.url
                : `${SITE_URL}${openGraph.url}`
            }
          />
          <meta property="og:type" content="website" />
        </>
      )}

      {images.map((image, index) => {
        const imageUrl = image.url.startsWith('http')
          ? image.url
          : `${SITE_URL}${image.url}`
        return (
          <Fragment key={image.url}>
            <meta property="og:image" content={imageUrl} />
            {/* twitter needs its own image tag */}
            {index === 0 && <meta name="twitter:image" content={imageUrl} />}
            {image.width && <meta property="og:image:width" content={`${image.width}`} />}
            {image.height && (
              <meta property="og:image:height" content={`${image.height}`} />
            )}
          </Fragment>
        )
      })}

      <meta property="og:locale" content={openGraph?.locale ?? 'en_US'} />
      <meta property="og:site_name" content={openGraph?.siteName || 'Tamagui'} />
    </>
  )
}
