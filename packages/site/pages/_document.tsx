import NextDocument, { Head, Html, Main, NextScript } from 'next/document'
import { Children } from 'react'

import Tamagui from '../tamagui.config'

export default class Document extends NextDocument {
  static async getInitialProps({ renderPage }) {
    const page = await renderPage()
    const styles = [<style dangerouslySetInnerHTML={{ __html: Tamagui.getCSS() }} />]
    return { ...page, styles: Children.toArray(styles) }
  }

  render() {
    return (
      <Html>
        <Head></Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
