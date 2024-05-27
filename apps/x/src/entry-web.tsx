import { Root, render } from 'vxs'

const routes = import.meta.glob('../app/**/*.tsx')

export function App({ path }: { path: string }) {
  return (
    <Root
      routes={routes}
      path={path}
      navigationContainerProps={
        {
          theme: {
            dark: true,
            colors: {
              primary: 'rgb(0, 122, 255)',
              background: 'transparent',
              card: 'rgb(255, 255, 255)',
              text: 'rgb(28, 28, 30)',
              border: 'rgb(216, 216, 216)',
              notification: 'rgb(255, 59, 48)',
            },
          },
        } as any
      }
    />
  )
}

render(App)
