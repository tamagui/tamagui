import { useState } from 'react'
import {
  Button,
  Checkbox,
  Input,
  Label,
  Paragraph,
  Progress,
  RadioGroup,
  Slider,
  Switch,
  Tabs,
  Text,
  XStack,
  YStack,
} from 'tamagui'

import {
  Result,
  SectionHeading,
  Specimen,
  SpecimenGrid,
  SpecimenHeader,
} from './PlaygroundParts'

export function ComponentPlayground() {
  const [name, setName] = useState('Desktop explorer')
  const [enabled, setEnabled] = useState(true)
  const [checked, setChecked] = useState<boolean | 'indeterminate'>(true)
  const [density, setDensity] = useState('comfortable')
  const [progress, setProgress] = useState(64)

  return (
    <YStack gap="$6">
      <SectionHeading
        index="02"
        title="Component controls"
        description="A compact set of non-Portal controls for checking that state, focus, sizing, and themes still behave normally beside the overlay system."
      />
      <SpecimenGrid>
        <Specimen>
          <SpecimenHeader
            title="Form controls"
            kind="State"
            description="Edit the input and toggle both boolean controls. Their values stay visible below."
          />
          <YStack gap="$3">
            <Label htmlFor="desktop-name" fontWeight="800">
              Session name
            </Label>
            <Input
              id="desktop-name"
              value={name}
              onChangeText={setName}
              placeholder="Name this run"
              testID="component-input"
            />
            <XStack items="center" justify="space-between" gap="$4">
              <Label htmlFor="desktop-switch">Desktop enhancements</Label>
              <Switch
                id="desktop-switch"
                checked={enabled}
                onCheckedChange={setEnabled}
                testID="component-switch"
              >
                <Switch.Thumb />
              </Switch>
            </XStack>
            <XStack items="center" gap="$3">
              <Checkbox
                id="desktop-checkbox"
                checked={checked}
                onCheckedChange={setChecked}
                testID="component-checkbox"
              >
                <Checkbox.Indicator>
                  <Text fontWeight="900">✓</Text>
                </Checkbox.Indicator>
              </Checkbox>
              <Label htmlFor="desktop-checkbox">Include keyboard checks</Label>
            </XStack>
          </YStack>
          <Result>
            {name || 'Untitled'} · {enabled ? 'enabled' : 'disabled'} ·{' '}
            {checked ? 'checked' : 'unchecked'}
          </Result>
        </Specimen>

        <Specimen>
          <SpecimenHeader
            title="Selection"
            kind="Keyboard"
            description="Arrow through the radio group, then change tabs to verify roving focus."
          />
          <RadioGroup value={density} onValueChange={setDensity} gap="$3">
            {['compact', 'comfortable', 'roomy'].map((value) => (
              <XStack key={value} items="center" gap="$3">
                <RadioGroup.Item value={value} id={`density-${value}`}>
                  <RadioGroup.Indicator />
                </RadioGroup.Item>
                <Label htmlFor={`density-${value}`} textTransform="capitalize">
                  {value}
                </Label>
              </XStack>
            ))}
          </RadioGroup>
          <Tabs defaultValue="preview" orientation="horizontal" flexDirection="column">
            <Tabs.List aria-label="Component preview tabs">
              <Tabs.Tab value="preview" flex={1}>
                <Text>Preview</Text>
              </Tabs.Tab>
              <Tabs.Tab value="tokens" flex={1}>
                <Text>Tokens</Text>
              </Tabs.Tab>
            </Tabs.List>
            <Tabs.Content value="preview" pt="$3">
              <Paragraph color="$color10">
                Controls render with {density} spacing.
              </Paragraph>
            </Tabs.Content>
            <Tabs.Content value="tokens" pt="$3">
              <Paragraph color="$color10">
                Theme tokens update with the toolbar.
              </Paragraph>
            </Tabs.Content>
          </Tabs>
          <Result>Density: {density}</Result>
        </Specimen>

        <Specimen>
          <SpecimenHeader
            title="Continuous values"
            kind="Pointer"
            description="Drag the thumb and verify macOS pointer tracking, progress fill, and value updates."
          />
          <YStack gap="$5" flex={1} justify="center">
            <XStack justify="space-between" items="center">
              <Text fontWeight="800">Build confidence</Text>
              <Text color="$purple10" fontWeight="900">
                {progress}%
              </Text>
            </XStack>
            <Slider
              value={[progress]}
              min={0}
              max={100}
              step={1}
              onValueChange={([value]) => setProgress(value)}
              testID="component-slider"
            >
              <Slider.Track>
                <Slider.TrackActive bg="$purple9" />
              </Slider.Track>
              <Slider.Thumb index={0} circular size="$2" bg="$purple10" />
            </Slider>
            <Progress value={progress} bg="$color4">
              <Progress.Indicator bg="$orange9" />
            </Progress>
            <XStack gap="$2">
              <Button size="$3" flex={1} onPress={() => setProgress(0)}>
                Reset
              </Button>
              <Button size="$3" flex={1} theme="accent" onPress={() => setProgress(100)}>
                Complete
              </Button>
            </XStack>
          </YStack>
          <Result>Pointer drag and animated fill</Result>
        </Specimen>
      </SpecimenGrid>
    </YStack>
  )
}
