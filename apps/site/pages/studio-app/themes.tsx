import { getStudioLayout } from '@components/layouts/StudioLayout'
import ThemesPage from '@protected/studio/(loaded)/(sponsor-protected)/themes/page'
import { useRequiresLoading } from '@protected/studio/useGlobalState'

export default function Page() {
  useRequiresLoading()
  return <ThemesPage />
}
Page.getLayout = getStudioLayout
