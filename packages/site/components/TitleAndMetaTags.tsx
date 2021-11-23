import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'

type TitleAndMetaTagsProps = {
  url?: string
  pathname?: string
  title?: string
  description?: string
  poster?: string
  image?: string
}

export function TitleAndMetaTags({
  url = 'https://tamagui.dev',
  pathname,
  title = 'Tamagui',
  description = '',
  poster,
  ...props
}: TitleAndMetaTagsProps) {
  const router = useRouter()

  const image = props.image ?? (poster ? `${url}/${poster}` : `${url}/social.png`)
  const path = pathname || router.pathname

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width" />
      <link rel="icon" href="/favicon.png" />
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />

      <meta property="og:url" content={`${url}${path}`} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      <meta name="twitter:site" content="@tamagui_js" />
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
  )
}
