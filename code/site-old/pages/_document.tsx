import NextDocument, { Head, Html, Main, NextScript } from 'next/document'
import { StyleSheet } from 'react-native'

import {
  LoadCherryBomb,
  LoadInter400,
  LoadInter700,
  LoadInter900,
  LoadMunro,
  LoadSilkscreen,
} from '../components/LoadFont'
import Tamagui from '../tamagui.config'

export default class Document extends NextDocument {
  static async getInitialProps({ renderPage }) {
    const page = await renderPage()

    // @ts-ignore RN doesn't have this type
    const rnwStyle = StyleSheet.getSheet()

    return {
      ...page,
      styles: (
        <>
          <style
            id={rnwStyle.id}
            dangerouslySetInnerHTML={{ __html: rnwStyle.textContent }}
          />
          <style
            dangerouslySetInnerHTML={{
              __html: Tamagui.getCSS(),
            }}
          />
        </>
      ),
    }
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.png" />
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" />

          <meta name="docsearch:language" content="en" />
          <meta name="docsearch:version" content="1.0.0,latest" />
          <meta id="theme-color" name="theme-color" />
          <meta name="color-scheme" content="light dark" />

          <LoadInter700 />
          <LoadInter400 />
          <LoadSilkscreen />

          {this.props.dangerousAsPath === '/studio' && (
            <>
              <LoadInter900 />
            </>
          )}

          {this.props.dangerousAsPath === '/takeout' && (
            <>
              <LoadCherryBomb />
              <LoadMunro />
            </>
          )}

          {this.props.dangerousAsPath === '/bento' && (
            <>
              <LoadCherryBomb />
              <LoadMunro />
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
