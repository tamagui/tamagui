import type { LoaderProps } from 'one'
import { useLoader } from 'one'
import { getTheme } from '~/features/studio/theme/getTheme'
import { ThemePage } from '~/features/studio/theme/ThemePage'

export async function loader(props: LoaderProps) {
  const subpath = props.params.subpath || ''
  // could be `/10/vercel` or something but we only want the id
  const id = subpath.includes('/') ? subpath.split('/')[0] : subpath

  return await getTheme(id)
}

export default function ThemeLayout() {
  const data = useLoader(loader)

  if (!data) {
    return null
  }

  return <ThemePage {...data} />
}
