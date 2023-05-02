import { getURL } from '@lib/helpers'
import * as colors from '@tamagui/colors'
import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

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
  const componentName = searchParams.has('name') ? searchParams.get('name')! : 'Component'
  const description = searchParams.has('description')
    ? searchParams.get('description')!
    : ''

  const imageData = `${getURL()}/screenshots/dark/${componentName}Demo.png`
  const logoData = await logo

  return new ImageResponse(
    (
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
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginLeft: 24,
            width: '50%',
          }}
        >
          <img
            width="217"
            height="23"
            style={{ marginBottom: 110, marginTop: -140 }}
            src={logoData}
          />

          <h1
            style={{
              color: colors.whiteA.whiteA12,
              fontWeight: 900,
              fontSize: 100,
              marginBottom: -10,
              fontFamily: 'Inter',
            }}
          >
            {componentName}
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
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            width: '50%',
          }}
        >
          <img width="512" height="512" src={imageData} />
        </div>
      </div>
    ),
    {
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
    }
  )
}
