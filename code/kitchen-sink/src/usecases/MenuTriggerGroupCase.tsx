import { Menu } from '@tamagui/menu'
import { useState } from 'react'
import { Button, Text, YStack } from 'tamagui'

function ExampleMenu({ name, disabled = false }: { name: string; disabled?: boolean }) {
  return (
    <Menu placement="bottom-start">
      <Menu.Trigger asChild disabled={disabled}>
        <Button data-testid={`trigger-${name}`} disabled={disabled}>
          {name}
        </Button>
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Content
          data-testid={`content-${name}`}
          minWidth={180}
          p="2"
          bg="background"
          borderColor="border-color"
          borderWidth={1}
          borderRadius="3"
          elevation="3"
        >
          <Menu.Group>
            <Menu.Item data-testid={`item-${name}`} p="2" textValue={`${name} action`}>
              <Menu.ItemTitle>{name} action</Menu.ItemTitle>
            </Menu.Item>
          </Menu.Group>
          <Menu.Sub>
            <Menu.SubTrigger data-testid={`sub-${name}`} p="2" textValue="More">
              <Menu.ItemTitle>More</Menu.ItemTitle>
            </Menu.SubTrigger>
            <Menu.Portal>
              <Menu.SubContent data-testid={`sub-content-${name}`}>
                <Menu.Item textValue="Nested action">
                  <Menu.ItemTitle>Nested action</Menu.ItemTitle>
                </Menu.Item>
              </Menu.SubContent>
            </Menu.Portal>
          </Menu.Sub>
        </Menu.Content>
      </Menu.Portal>
    </Menu>
  )
}

function SharedMenu() {
  const [open, setOpen] = useState(false)
  const [label, setLabel] = useState('Alpha')
  return (
    <Menu open={open} onOpenChange={setOpen} placement="bottom-start">
      <Menu.TriggerGroup data-testid="group-shared" gap="2">
        {['Alpha', 'Beta', 'Gamma'].map((name) => (
          <Menu.Trigger
            key={name}
            asChild
            onMouseEnter={() => setLabel(name)}
            onFocus={() => setLabel(name)}
          >
            <Button data-testid={`shared-${name}`}>{name}</Button>
          </Menu.Trigger>
        ))}
      </Menu.TriggerGroup>
      <Menu.TriggerGroup data-testid="group-shared-other" gap="2">
        <Menu.Trigger
          asChild
          onMouseEnter={() => setLabel('Separate')}
          onFocus={() => setLabel('Separate')}
        >
          <Button data-testid="shared-Separate">Separate</Button>
        </Menu.Trigger>
      </Menu.TriggerGroup>
      <Menu.Portal>
        <Menu.Content data-testid="shared-content" minWidth={180}>
          <Menu.Item data-testid="shared-item" textValue={label}>
            <Menu.ItemTitle>{label}</Menu.ItemTitle>
          </Menu.Item>
        </Menu.Content>
      </Menu.Portal>
    </Menu>
  )
}

export function MenuTriggerGroupCase() {
  return (
    <YStack p="4" gap="4">
      <Text>Grouped menu triggers</Text>
      <Menu.TriggerGroup gap="2" data-testid="group-primary">
        <ExampleMenu name="File" />
        <ExampleMenu name="Disabled" disabled />
        <ExampleMenu name="Edit" />
        <ExampleMenu name="View" />
      </Menu.TriggerGroup>
      <Menu.TriggerGroup gap="2" data-testid="group-other">
        <ExampleMenu name="Other" />
      </Menu.TriggerGroup>
      <ExampleMenu name="Ungrouped" />
      <SharedMenu />
      <Menu.TriggerGroup dir="rtl" gap="2" data-testid="group-rtl">
        <ExampleMenu name="First" />
        <ExampleMenu name="Second" />
      </Menu.TriggerGroup>
      <Button data-testid="outside">Outside</Button>
    </YStack>
  )
}
