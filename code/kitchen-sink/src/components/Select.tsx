// The canonical v2-look Select skin is the default styled Select in `tamagui`.
// Kitchen-sink consumes it directly. `AltSelect` stays here as a demo of
// re-skinning the canonical parts (it is kitchen-sink-specific).
import {
  Select,
  SelectGroup,
  SelectIcon,
  SelectIndicator,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectLabel,
  SelectRoot,
  type SelectRootProps,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  type SelectSize,
  SelectTrigger,
  SelectValue,
  SelectViewport,
  selectParts,
  styled,
  withStaticProperties,
} from 'tamagui'

export {
  Select,
  SelectGroup,
  SelectIcon,
  SelectIndicator,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectLabel,
  SelectRoot,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  SelectViewport,
  type SelectSize,
}

function AltSelectRoot<
  Value extends string = string,
  Multiple extends boolean | undefined = false,
>(props: SelectRootProps<Value, Multiple>) {
  return <SelectRoot<Value, Multiple> {...props} />
}

const AltTrigger = styled(SelectTrigger, {
  displayName: 'KitchenAltSelectTrigger',
  backgroundColor: 'purple3',
  borderColor: 'purple8',
  borderRadius: 1000,
})

const AltValue = styled(SelectValue, {
  displayName: 'KitchenAltSelectValue',
  color: 'purple11',
  fontFamily: 'monospace',
})

const AltItem = styled(SelectItem, {
  displayName: 'KitchenAltSelectItem',
  borderRadius: 1000,
  backgroundColor: 'hover:purple4 focus:purple5',
})

const AltItemText = styled(SelectItemText, {
  displayName: 'KitchenAltSelectItemText',
  color: 'purple11',
  fontFamily: 'monospace',
})

const AltItemIndicator = styled(SelectItemIndicator, {
  displayName: 'KitchenAltSelectItemIndicator',
  children: '●',
})

const AltViewport = styled(SelectViewport, {
  displayName: 'KitchenAltSelectViewport',
  backgroundColor: 'purple2',
  borderColor: 'purple8',
  borderRadius: 22,
})

const AltScrollUpButton = styled(SelectScrollUpButton, {
  displayName: 'KitchenAltSelectScrollUpButton',
  backgroundColor: 'purple3',
})

const AltScrollDownButton = styled(SelectScrollDownButton, {
  displayName: 'KitchenAltSelectScrollDownButton',
  backgroundColor: 'purple3',
})

export const AltSelect = withStaticProperties(AltSelectRoot, {
  Root: AltSelectRoot,
  ...selectParts,
  Trigger: AltTrigger,
  Value: AltValue,
  Item: AltItem,
  ItemText: AltItemText,
  ItemIndicator: AltItemIndicator,
  Viewport: AltViewport,
  ScrollUpButton: AltScrollUpButton,
  ScrollDownButton: AltScrollDownButton,
})
