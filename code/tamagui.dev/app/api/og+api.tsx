import * as colors from '@tamagui/colors'
import type { ReactElement } from 'react'
import { getURL } from 'one'
import { apiRoute } from '~/features/api/apiRoute'

export default apiRoute(async (req) => {
  const { ImageResponse } = await import('@vercel/og')

  const [interRegularFont, interBoldFont] = await Promise.all([
    interRegularFontP,
    interBoldFontP,
  ])

  const { searchParams } = new URL(req.url)

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

  return getImageResponse(<BackgroundedOg searchParams={searchParams} logo={logoData} />)
})

const fetchAsset = (url: URL) => fetch(url).then((res) => res.arrayBuffer())

const interRegularFontP = fetchAsset(
  new URL(`${getURL()}/fonts/otf/Inter-Regular.otf`, import.meta.url)
)

const interBoldFontP = fetchAsset(
  new URL(`${getURL()}/fonts/otf/Inter-Black.otf`, import.meta.url)
)

const logo = fetchAsset(new URL(`${getURL()}/tamagui-words-logo.png`, import.meta.url))

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

  const imageData = `${getURL()}/screenshots/dark/${demoName}Demo/650x650.png`

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        padding: 20,
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

const BackgroundedOg = ({
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
  const title = searchParams.has('title') ? searchParams.get('title')! : ''
  const description = searchParams.has('description')
    ? searchParams.get('description')!
    : ''

  const hasCategory = searchParams.has('category')
  const category = searchParams.get('category')

  const imageData = `${getURL()}/screenshots/dark/${demoName}Demo/1200x630.png`

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        padding: 30,
        // backgroundColor: '#050505',
        background: `url(${getURL()}/bg-grid.png)`,
        flexDirection: 'row',
        alignItems: 'flex-end',
      }}
    >
      {hasDemo ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            right: 0,
            top: 0,
            // height: 200,
            background: `url(${imageData})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'cover',
          }}
        />
      ) : (
        <Logo pos="left" source={logo} />
      )}

      {hasDemo && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            right: 0,
            height: 500,
            transform: `rotate(12deg) scale(1.5)`,
            background: `linear-gradient(0deg, black, transparent)`,
          }}
        />
      )}

      <div
        style={{
          display: 'flex',
          marginRight: 30,
          flexDirection: 'column',
          // alignItems: 'center',
        }}
      >
        {hasCategory && (
          <h6
            style={{
              color: colors.whiteA.whiteA12,
              fontWeight: 600,
              opacity: 0.75,
              fontSize: 24,
              marginBottom: -10,
              fontFamily: 'Inter',
              textAlign: 'center',
              textTransform: 'uppercase',
              letterSpacing: 10,
              marginLeft: 10,
            }}
          >
            {category}
          </h6>
        )}
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
    </div>
  )
}

const Logo = ({ source, pos }: { source: any; pos: 'left' | 'center' }) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: 60,
        right: 60,
        top: 60,
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
