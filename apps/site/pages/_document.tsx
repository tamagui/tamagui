import NextDocument, { Head, Html, Main, NextScript } from 'next/document'
import { Children } from 'react'
import { AppRegistry } from 'react-native'

import Tamagui from '../tamagui.config'

export default class Document extends NextDocument {
  static async getInitialProps(props) {
    const { renderPage } = props
    AppRegistry.registerComponent('Main', () => Main)
    const page = await renderPage()
    // @ts-ignore
    const { getStyleElement } = AppRegistry.getApplication('Main')
    const styles = [
      getStyleElement(),
      <style
        key="tamagui-css"
        dangerouslySetInnerHTML={{
          __html: Tamagui.getCSS({
            exclude: process.env.NODE_ENV === 'development' ? null : 'design-system',
          }),
        }}
      />,
    ]
    return { ...page, styles: Children.toArray(styles) }
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.png" />
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" />

          <meta name="docsearch:language" content="en" />
          <meta name="docsearch:version" content="1.0.0,latest" />

          <link
            rel="preload"
            href="/fonts/subset-Inter-ExtraBold.woff2"
            as="font"
            type="font/woff2"
          />
          <link
            rel="preload"
            href="/fonts/subset-Inter-Regular.woff2"
            as="font"
            type="font/woff2"
          />

          <link rel="preload" href="/fonts/slkscr.woff2" as="font" type="font/woff2" />

          {this.props.dangerousAsPath === '/studio' && (
            <>
              <link href="/fonts/inter-takeout.css" rel="stylesheet" />
              <link
                rel="preload"
                href="/fonts/subset-Inter-Black.woff2"
                as="font"
                type="font/woff2"
              />
            </>
          )}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
