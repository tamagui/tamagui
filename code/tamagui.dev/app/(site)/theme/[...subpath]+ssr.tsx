import type { LoaderProps } from 'one'
import { useLoader } from 'one'
import { HeadInfo } from '~/components/HeadInfo'
import { getTheme } from '~/features/studio/theme/getTheme'
import { ThemePageUpdater } from '~/features/studio/theme/ThemePage'

export async function loader(props: LoaderProps) {
  const subpath = props.params.subpath || ''
  // could be `/10/vercel` or something but we only want the id
  // @ts-ignore
  const id = subpath.includes('/') ? subpath.split('/')[0] : subpath

  return await getTheme(id)
}

export default function ThemeLayout() {
  const data = useLoader(loader)

  if (!data) {
    return null
  }

  return (
    <>
      <HeadInfo
        title={`${data.search || 'Tamagui Theme Builder'} - Tamagui Theme`}
        description={
          data.search ? `Tamagui Theme for ${data.search}` : `Tamagui Theme Builder`
        }
        openGraph={{
          url: `https://tamagui.dev/api/theme/open-graph?id=${data.id || '0'}`,
          images: [
            {
              url: `https://tamagui.dev/api/theme/open-graph?id=${data.id || '0'}`,
            },
          ],
        }}
      />
      <ThemePageUpdater {...data} />
    </>
  )
}
