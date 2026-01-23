// helper for SEO/social meta attributes

import { Fragment } from 'react'

const SITE_URL = process.env.ONE_SERVER_URL || 'https://tamagui.dev'

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

      {openGraph && (
        <>
          {openGraph.url && (
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

          {openGraph.images?.map((image) => {
            const imageUrl = image.url.startsWith('http')
              ? image.url
              : `${SITE_URL}${image.url}`
            return (
              <Fragment key={image.url}>
                <meta property="og:image" content={imageUrl} />
                {image.width && (
                  <meta property="og:image:width" content={`${image.width}`} />
                )}
                {image.height && (
                  <meta property="og:image:height" content={`${image.height}`} />
                )}
              </Fragment>
            )
          })}

          <meta property="og:locale" content={openGraph.locale ?? 'en_US'} />
          <meta property="og:site_name" content={openGraph.siteName || 'Tamagui'} />
        </>
      )}
    </>
  )
}
