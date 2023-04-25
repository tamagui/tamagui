import { getStudioLayout } from '@components/layouts/StudioLayout'
import ColorsPage from '@protected/studio/(loaded)/(sponsor-protected)/colors/page'
import { useRequiresLoading } from '@protected/studio/state/useGlobalState'

export default function Page() {
  useRequiresLoading()
  return <ColorsPage />
}
Page.getLayout = getStudioLayout
