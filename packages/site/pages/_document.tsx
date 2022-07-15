import NextDocument, { Head, Html, Main, NextScript } from 'next/document'
import React, { Children } from 'react'
import { AppRegistry } from 'react-native'

import Tamagui from '../tamagui.config'

export default class Document extends NextDocument {
  static async getInitialProps({ renderPage }) {
    AppRegistry.registerComponent('Main', () => Main)
    const page = await renderPage()
    // @ts-ignore
    const { getStyleElement } = AppRegistry.getApplication('Main')
    const styles = [
      getStyleElement(),
      <style key="tamagui-css" dangerouslySetInnerHTML={{ __html: Tamagui.getCSS() }} />,
    ]
    return { ...page, styles: Children.toArray(styles) }
  }

  render() {
    return (
      <Html>
        <Head>
          <style
            dangerouslySetInnerHTML={{
              __html: `@font-face {
                font-family: 'Inter';
                src: url('/fonts/subset-Inter-Medium.woff2') format('woff2'),
                    url('/fonts/subset-Inter-Medium.woff') format('woff');
                font-weight: 400;
                font-style: normal;
                font-display: swap;
              }
              @font-face {
                font-family: 'Inter';
                src: url('/fonts/subset-Inter-ExtraBold.woff2') format('woff2'),
                    url('/fonts/subset-Inter-ExtraBold.woff') format('woff');
                font-weight: 700;
                font-style: normal;
                font-display: swap;
              }`,
            }}
          />
          <meta name="docsearch:language" content="en" />
          <meta name="docsearch:version" content="1.0.0,latest" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
