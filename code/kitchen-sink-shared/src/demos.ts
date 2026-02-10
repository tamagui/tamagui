export interface DemoItem {
  title: string
  key: string
}

// demo registry - key is the prefix used to look up {key}Demo from @tamagui/demos
// titles here are what Maestro flows match on, so keep them exact
export const demos: DemoItem[] = [
  { title: 'Stacks', key: 'Stacks' },
  { title: 'Headings', key: 'Headings' },
  { title: 'Text', key: 'Text' },
  { title: 'Animations', key: 'Animations' },
  { title: 'Animate Presence', key: 'AnimationsPresence' },
  { title: 'Themes', key: 'AddTheme' },
  { title: 'AlertDialog', key: 'AlertDialog' },
  { title: 'Dialog', key: 'Dialog' },
  { title: 'Popover', key: 'Popover' },
  { title: 'Sheet', key: 'Sheet' },
  { title: 'Toast', key: 'Toast' },
  { title: 'Button', key: 'Button' },
  { title: 'Checkbox', key: 'Checkbox' },
  { title: 'Form', key: 'Forms' },
  { title: 'Input', key: 'Inputs' },
  { title: 'Label', key: 'Label' },
  { title: 'Progress', key: 'Progress' },
  { title: 'Select', key: 'Select' },
  { title: 'Slider', key: 'Slider' },
  { title: 'Switch', key: 'Switch' },
  { title: 'RadioGroup', key: 'RadioGroup' },
  { title: 'ToggleGroup', key: 'ToggleGroup' },
  { title: 'Avatar', key: 'Avatar' },
  { title: 'Card', key: 'Card' },
  { title: 'Group', key: 'Group' },
  { title: 'Image', key: 'Image' },
  { title: 'ListItem', key: 'ListItem' },
  { title: 'Tabs', key: 'Tabs' },
  { title: 'LinearGradient', key: 'LinearGradient' },
  { title: 'Separator', key: 'Separator' },
  { title: 'Shapes', key: 'Shapes' },
  { title: 'Spinner', key: 'Spinner' },
]
