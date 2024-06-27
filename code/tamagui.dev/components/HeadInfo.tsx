// helper for SEO/social meta attributes

import { Fragment } from 'react'

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
              <meta property="og:url" content={openGraph.url} />
              <meta property="og:type" content="website" />
            </>
          )}

          {openGraph.images?.map((image) => {
            return (
              <Fragment key={image.url}>
                <meta property="og:image" content={image.url} />
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
