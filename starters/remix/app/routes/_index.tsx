import type { MetaFunction } from '@remix-run/node'
import { Link } from '@remix-run/react'
import { H1, View } from 'tamagui'

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ]
}

export default function Index() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.8' }}>
      <H1>Tamagui + Remix</H1>
      <View tag="ul">
        <View tag="li">
          <Link
            target="_blank"
            to="https://developers.cloudflare.com/pages/framework-guides/deploy-a-remix-site/"
            rel="noreferrer"
          >
            Cloudflare Pages Docs - Remix guide
          </Link>
        </View>
        <View tag="li">
          <Link target="_blank" to="https://remix.run/docs" rel="noreferrer">
            Remix Docs
          </Link>
        </View>
      </View>
    </div>
  )
}
