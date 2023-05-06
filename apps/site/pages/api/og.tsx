import { getURL } from '@lib/helpers'
import * as colors from '@tamagui/colors'
import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'
import { ReactElement } from 'react'

export const config = {
  runtime: 'edge',
}

const fetchAsset = (url: URL) => fetch(url).then((res) => res.arrayBuffer())

const interRegularFontP = fetchAsset(
  new URL('../../public/fonts/subset-Inter-Regular.woff', import.meta.url)
)

const interBoldFontP = fetchAsset(
  new URL('../../public/fonts/subset-Inter-Black.woff', import.meta.url)
)

const logo = fetchAsset(new URL('../../public/tamagui-words-logo.png', import.meta.url))

export default async function handler(request: NextRequest) {
  const [interRegularFont, interBoldFont] = await Promise.all([
    interRegularFontP,
    interBoldFontP,
  ])

  const { searchParams } = new URL(request.url)

  const type = searchParams.has('type')
    ? searchParams.get('type')?.slice(0, 100)
    : 'unknown'
  const logoData = await logo
  const getImageResponse = (jsx: ReactElement) =>
    new ImageResponse(jsx, {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Inter',
          data: interRegularFont,
          style: 'normal',
          weight: 400,
        },
        {
          name: 'Inter',
          data: interBoldFont,
          style: 'normal',
          weight: 700,
        },
      ],
    })

  if (type === 'component') {
    return getImageResponse(<ComponentOg searchParams={searchParams} logo={logoData} />)
  }

  return getImageResponse(<DefaultOg searchParams={searchParams} logo={logoData} />)
}

const ComponentOg = ({
  searchParams,
  logo,
}: {
  searchParams: URLSearchParams
  logo: any
}) => {
  const hasDemo = searchParams.has('demoName')
  // demoName name. e.g. "Input"
  const demoName = hasDemo ? searchParams.get('demoName') : null
  // title. e.g. Input And TextArea
  const title = searchParams.has('title') ? searchParams.get('title')! : demoName
  const description = searchParams.has('description')
    ? searchParams.get('description')!
    : ''

  const imageData = `${getURL()}/screenshots/dark/${demoName}Demo.png`

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        padding: '20px',
        // backgroundColor: '#050505',
        background: `url(${getURL()}/bg-grid.png)`,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Logo pos="left" source={logo} />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          marginLeft: 44,
          ...(!!hasDemo ? { flex: 1 } : {}),
        }}
      >
        <h1
          style={{
            color: colors.whiteA.whiteA12,
            fontWeight: 900,
            fontSize: 96,
            marginBottom: -10,
            fontFamily: 'Inter',
          }}
        >
          {title}
        </h1>
        <p
          style={{
            color: colors.whiteA.whiteA10,
            fontSize: 32,
            // lineHeight: 1,
            fontFamily: 'Inter',
          }}
        >
          {description}
        </p>
      </div>

      {!!hasDemo && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            flex: 1,
          }}
        >
          <img width="512" height="512" src={imageData} />
        </div>
      )}
    </div>
  )
}

const DefaultOg = ({
  searchParams,
  logo,
}: {
  searchParams: URLSearchParams
  logo: any
}) => {
  const title = searchParams.has('title') ? searchParams.get('title')! : ''
  const description = searchParams.has('description')
    ? searchParams.get('description')!
    : ''

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        padding: '20px',
        // backgroundColor: '#050505',
        background: `url(${getURL()}/bg-grid.png)`,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Logo pos="center" source={logo} />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <h1
          style={{
            color: colors.whiteA.whiteA12,
            fontWeight: 900,
            fontSize: 96,
            marginBottom: -10,
            fontFamily: 'Inter',
            textAlign: 'center',
          }}
        >
          {title}
        </h1>
        <p
          style={{
            color: colors.whiteA.whiteA10,
            fontSize: 32,
            // lineHeight: 1,
            fontFamily: 'Inter',
            textAlign: 'center',
          }}
        >
          {description}
        </p>
      </div>
    </div>
  )
}

const Logo = ({ source, pos }: { source: any; pos: 'left' | 'center' }) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: 96,
        right: 96,
        top: 64,
        display: 'flex',
        ...(pos === 'center'
          ? {
              justifyContent: 'center',
            }
          : {}),
      }}
    >
      <img width="217" height="23" src={source} />
    </div>
  )
}
