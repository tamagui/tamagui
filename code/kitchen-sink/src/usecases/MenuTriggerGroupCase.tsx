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
          boxShadow="0 4px 12px shadow-color"
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

function SharedMenu({ isolation = false }: { isolation?: boolean }) {
  const prefix = isolation ? 'isolation' : 'shared'
  const [open, setOpen] = useState(false)
  const [label, setLabel] = useState('Alpha')
  return (
    <Menu open={open} onOpenChange={setOpen} placement="bottom-start">
      <Menu.TriggerGroup data-testid="group-shared" gap="2">
        {(isolation
          ? ['Alpha', 'Beta', 'Disabled', 'Gamma']
          : ['Alpha', 'Beta', 'Gamma']
        ).map((name) => (
          <Menu.Trigger
            key={name}
            disabled={name === 'Disabled'}
            asChild
            onMouseEnter={() => setLabel(name)}
            onFocus={() => setLabel(name)}
          >
            <Button data-testid={`${prefix}-${name}`}>{name}</Button>
          </Menu.Trigger>
        ))}
      </Menu.TriggerGroup>
      <Menu.TriggerGroup data-testid="group-shared-other" gap="2">
        <Menu.Trigger
          asChild
          onMouseEnter={() => setLabel('Separate')}
          onFocus={() => setLabel('Separate')}
        >
          <Button data-testid={`${prefix}-Separate`}>Separate</Button>
        </Menu.Trigger>
      </Menu.TriggerGroup>
      {isolation && (
        <>
          <Menu.Trigger asChild>
            <Button data-testid="isolation-Ungrouped">Ungrouped</Button>
          </Menu.Trigger>
          <Menu.Trigger asChild disabled>
            <Button data-testid="isolation-UngroupedDisabled">Ungrouped disabled</Button>
          </Menu.Trigger>
        </>
      )}
      <Menu.Portal>
        <Menu.Content data-testid={`${prefix}-content`} minWidth={180}>
          <Menu.Item data-testid={`${prefix}-item`} textValue={label}>
            <Menu.ItemTitle>{label}</Menu.ItemTitle>
          </Menu.Item>
        </Menu.Content>
      </Menu.Portal>
    </Menu>
  )
}

function MixedMenu() {
  const [label, setLabel] = useState('First')
  const [checked, setChecked] = useState(false)
  return (
    <Menu placement="bottom-start" offset={0}>
      <YStack gap={24} alignItems="flex-start">
        {['First', 'Second'].map((name) => (
          <Menu.Trigger key={name} asChild onMouseEnter={() => setLabel(name)}>
            <Button data-testid={`mixed-${name}`}>{name} menu</Button>
          </Menu.Trigger>
        ))}
        <Menu.TriggerGroup>
          <Menu.Trigger asChild>
            <Button>Grouped one</Button>
          </Menu.Trigger>
        </Menu.TriggerGroup>
        <Menu.TriggerGroup>
          <Menu.Trigger asChild>
            <Button>Grouped two</Button>
          </Menu.Trigger>
        </Menu.TriggerGroup>
      </YStack>
      <Menu.Portal>
        <Menu.Content data-testid="mixed-content" width={195} p={0}>
          <Menu.CheckboxItem
            data-testid="mixed-check"
            checked={checked}
            onCheckedChange={setChecked}
            height={36}
            textValue={`${label} check`}
            onSelect={(event) => event.preventDefault()}
          >
            <Menu.ItemTitle>{label} check</Menu.ItemTitle>
          </Menu.CheckboxItem>
          <Menu.Item height={36} textValue={`${label} action`}>
            <Menu.ItemTitle>{label} action</Menu.ItemTitle>
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
      <SharedMenu isolation />
      <MixedMenu />
      <Menu.TriggerGroup dir="rtl" gap="2" data-testid="group-rtl">
        <ExampleMenu name="First" />
        <ExampleMenu name="Second" />
      </Menu.TriggerGroup>
      <Button data-testid="outside">Outside</Button>
    </YStack>
  )
}
