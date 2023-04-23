import { getStudioLayout } from '@components/layouts/StudioLayout'
import LoadPage from '@protected/studio/load/page'

export default function Page() {
  return <LoadPage />
}

Page.getLayout = getStudioLayout
