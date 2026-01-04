import { Children } from 'react'
import { AppRegistry } from 'react-native'
import NextDocument, {
  type DocumentContext,
  type DocumentInitialProps,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document'
import { config } from '@my/ui'

export default class Document extends NextDocument {
  static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
    AppRegistry.registerComponent('Main', () => Main)
    const page = await ctx.renderPage()

    // @ts-ignore
    const { getStyleElement } = AppRegistry.getApplication('Main')

    /**
     * Note: be sure to keep tamagui styles after react-native-web styles like it is here!
     * So Tamagui styles can override the react-native-web styles.
     */
    const styles = [
      getStyleElement(),
      <style
        key="tamagui-css"
        dangerouslySetInnerHTML={{
          __html: config.getCSS({
            exclude: process.env.NODE_ENV === 'development' ? null : 'design-system',
          }),
        }}
      />,
      <style
        jsx
        global
        key="tamagui-css"
      >{`
        html {
          font-family: 'Inter';
        }
      `}</style>,
    ]

    return { ...page, styles: Children.toArray(styles) }
  }

  render() {
    return (
      <Html>
        <Head>
          <meta
            httpEquiv="X-UA-Compatible"
            content="IE=edge"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
