import type { LoaderProps } from 'one'
import { useLoader } from 'one'
import { getTheme } from '~/features/studio/theme/getTheme'
import { ThemePage } from '~/features/studio/theme/ThemePage'

export async function loader(props: LoaderProps) {
  return await getTheme(props.params.id)
}

export default function ThemeLayout() {
  const data = useLoader(loader)

  if (!data) {
    return null
  }

  return <ThemePage {...data} />
}
