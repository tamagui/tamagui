import { ChevronLeft } from '@tamagui/lucide-icons'
import { memo } from 'react'
import { Button, Spacer, XStack } from 'tamagui'

import { ThemeSwitch } from '../bar/StudioBar'
import { StudioThemeBuilderSettingsDropdown } from './StudioThemeBuilderSettingsDropdown'
import { useRouter } from 'one'

export const StudioThemeBuilderActionBar = memo(function StudioThemeBuilderActionBar() {
  const router = useRouter()

  return (
    <XStack zi={100000} gap="$3" flex={1} ai="center" jc="space-between">
      {/* <Button
        chromeless
        size="$2"
        circular
        icon={ChevronLeft}
        onPress={() => {
          router.push('/')
        }}
      /> */}

      {/* <ThemeSuiteSelect /> */}
      <ThemeSwitch />
      <StudioThemeBuilderSettingsDropdown />
    </XStack>
  )
})

// const ThemeSuiteSelect = memo(() => {
//   const { themeId } = useParams()
//   const navigate = useNavigate()
//   const themes = useTable('themes')
//   const themeEntries = Object.entries(themes)

//   return (
//     <Select
//       size="$2"
//       defaultValue="ok"
//       width={140}
//       onValueChange={(id) => {
//         navigate(`/builder/${id}`)
//       }}
//       value={themeId}
//     >
//       {themeEntries.map(([id, theme], idx) => (
//         <Select.Item key={id} value={id} index={idx}>
//           {theme.name}
//         </Select.Item>
//       ))}
//     </Select>
//   )
// })
