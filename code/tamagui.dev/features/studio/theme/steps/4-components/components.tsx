import { SelectDemo } from '@tamagui/demos'
import { Moon } from '@tamagui/lucide-icons'
import { Button, ButtonFrame, ButtonText } from 'tamagui'

export type PreviewComponent = {
  Preview: React.FC<{}>
  parts: { name: string; Preview: React.FC<{}> }[]
}

export const components = {
  ButtonPreview: {
    parts: [
      { name: 'Button', Preview: () => <ButtonFrame size="$4" miw={200}></ButtonFrame> },
      { name: 'ButtonText', Preview: () => <ButtonText>Abc</ButtonText> },
    ],
    Preview: () => {
      return <Button icon={Moon}>Test</Button>
    },
  },
  SelectPreview: {
    parts: [
      { name: 'Select', Preview: () => <SelectDemo /> },
      { name: 'SelectItem', Preview: () => <SelectDemo /> },
      { name: 'SelectLabel', Preview: () => <SelectDemo /> },
      { name: 'SelectTrigger', Preview: () => <SelectDemo /> },
      { name: 'SelectValue', Preview: () => <SelectDemo /> },
    ],
    Preview: () => {
      return <SelectDemo />
    },
  },
} satisfies Record<string, PreviewComponent>
