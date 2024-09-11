import type { MetaFunction } from '@remix-run/node'
import { Text, Stack } from 'tamagui'
import { Link } from '@remix-run/react'

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ]
}

export default function Index() {
  return (
    <Stack tag="section" style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.8' }}>
      <Text>Tamagui + Remix</Text>
      <Stack tag="ul">
        <Stack tag="li">
          <Link to="/test">Test</Link>
        </Stack>
        <Stack tag="li">
          <Link
            target="_blank"
            href="https://developers.cloudflare.com/pages/framework-guides/deploy-a-remix-site/"
            rel="noreferrer"
          >
            Cloudflare Pages Docs - Remix guide
          </Link>
        </Stack>
        <Stack tag="li">
          <Link target="_blank" href="https://remix.run/docs" rel="noreferrer">
            Remix Docs
          </Link>
        </Stack>
      </Stack>
    </Stack>
  )
}
