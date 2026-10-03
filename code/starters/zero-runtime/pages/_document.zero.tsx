import NextDocument, { Head, Html, Main, NextScript } from 'next/document'

export default class Document extends NextDocument {
  render() {
    return (
      <Html>
        <Head>
          {/* the one generated zero-runtime CSS artifact, owned by the bundler */}
          <link rel="stylesheet" href="/tamagui-zero.css" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
