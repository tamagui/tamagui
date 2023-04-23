import { getStudioLayout } from '@components/layouts/StudioLayout'
import ConfigPage from '@protected/studio/(loaded)/(sponsor-protected)/config/page'
import { useRequiresLoading } from '@protected/studio/useGlobalState'

export default function Page() {
  useRequiresLoading()
  return <ConfigPage />
}

Page.getLayout = getStudioLayout
