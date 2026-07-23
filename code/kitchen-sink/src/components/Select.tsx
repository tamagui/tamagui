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
  selectSizes,
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
  selectSizes,
  type SelectSize,
}

function AltSelectRoot<
  Value extends string = string,
  Multiple extends boolean | undefined = false,
>(props: SelectRootProps<Value, Multiple>) {
  return <SelectRoot<Value, Multiple> {...props} />
}

const AltTrigger = styled(SelectTrigger, {
  name: 'KitchenAltSelectTrigger',
  backgroundColor: '$purple3',
  borderColor: '$purple8',
  borderRadius: 1000,
})

const AltValue = styled(SelectValue, {
  name: 'KitchenAltSelectValue',
  color: '$purple11',
  fontFamily: '$mono',
})

const AltItem = styled(SelectItem, {
  name: 'KitchenAltSelectItem',
  borderRadius: 1000,
  hoverStyle: { backgroundColor: '$purple4' },
  focusStyle: { backgroundColor: '$purple5' },
})

const AltItemText = styled(SelectItemText, {
  name: 'KitchenAltSelectItemText',
  color: '$purple11',
  fontFamily: '$mono',
})

const AltItemIndicator = styled(SelectItemIndicator, {
  name: 'KitchenAltSelectItemIndicator',
  children: '●',
})

const AltViewport = styled(SelectViewport, {
  name: 'KitchenAltSelectViewport',
  backgroundColor: '$purple2',
  borderColor: '$purple8',
  borderRadius: 22,
})

const AltScrollUpButton = styled(SelectScrollUpButton, {
  name: 'KitchenAltSelectScrollUpButton',
  backgroundColor: '$purple3',
})

const AltScrollDownButton = styled(SelectScrollDownButton, {
  name: 'KitchenAltSelectScrollDownButton',
  backgroundColor: '$purple3',
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
