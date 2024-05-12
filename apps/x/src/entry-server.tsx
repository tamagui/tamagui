import { renderToString } from '@vxrn/router/server-render'
import { App } from './entry-web'
import tamaguiConfig from './tamagui.config'

export const render = async ({ path }: { path: string }) => {
  const out = await renderToString(<App path={path} />)
  const css = tamaguiConfig.getCSS({ exclude: 'design-system' })
  return {
    ...out,
    headHtml: out.headHtml + '\n' + `<style>${css}</style>`,
  }
}
