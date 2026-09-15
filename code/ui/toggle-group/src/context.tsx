import { createStyledContext } from '@tamagui/web'

export const context = createStyledContext<{ color?: string; active: boolean }>({
  color: undefined,
  active: false,
})

export const useToggleGroupItem = () => {
  return context.useStyledContext()
}
