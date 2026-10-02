import { Bot, Check, Copy, ExternalLink, Moon, Sun, X } from '~/components/icons'
import { memo, useState } from 'react'
import {
  Button as TButton,
  Dialog,
  Input,
  Paragraph,
  ScrollView,
  SizableText,
  Theme,
  XStack,
  YStack,
} from 'tamagui'
import { Button } from '~/components/Button'
import { toastController } from '../ToastProvider'
import { RandomizeButton } from './RandomizeButton'
import { AGENT_THEME_SKILL_TEXT, THEME_PRESETS } from './constants/themePresets'
import { applyThemeFromUrl, decodeThemePayload } from './helpers/urlTheme'
import { useThemeBuilderStore } from './store/ThemeBuilderStore'
import { ThemeToggle } from '~/features/site/theme/ThemeToggle'

export interface StudioAIBarProps {
  initialTheme?: any
}

export const StudioThemeAgentBar = memo((_props: StudioAIBarProps) => {
  const store = useThemeBuilderStore()
  const [copied, setCopied] = useState(false)
  const [isSkillOpen, setSkillOpen] = useState(false)
  const [isImportOpen, setImportOpen] = useState(false)
  const [importInput, setImportInput] = useState('')
  const [activePreset, setActivePreset] = useState<string>('Violet')

  const copySkill = async () => {
    try {
      await navigator.clipboard.writeText(AGENT_THEME_SKILL_TEXT)
      setCopied(true)
      toastController.show('Copied theme generator agent skill!')
      setTimeout(() => setCopied(false), 2500)
    } catch (err) {
      toastController.show('Failed to copy to clipboard')
    }
  }

  const handleApplyPreset = (preset: (typeof THEME_PRESETS)[0]) => {
    setActivePreset(preset.name)
    store.updateGenerate(preset, preset.name, `preset-${preset.name}`)
    toastController.show(`Applied preset: ${preset.name}`)
  }

  const handleApplyImport = () => {
    if (!importInput.trim()) return
    const input = importInput.trim()
    let payload = input

    // If input is a URL with #theme= or ?theme=
    if (input.includes('#') || input.includes('?')) {
      const match = input.match(/[#?](?:theme|config|data)=([^&]+)/)
      if (match && match[1]) {
        payload = match[1]
      }
    }

    const decoded = decodeThemePayload(payload)
    if (decoded) {
      const ok = applyThemeFromUrl(decoded)
      if (ok) {
        setActivePreset('')
        setImportOpen(false)
        setImportInput('')
        return
      }
    }

    toastController.show('Invalid theme config or URL')
  }

  return (
    <YStack gap="3" width="100%" z={1000}>
      {/* Hero Agent Skill Callout */}
      <YStack
        p="4"
        rounded="8"
        bg="color-2"
        borderColor="border-color"
        borderWidth={0.5}
        boxShadow="0 4px 16px shadow-color"
        gap="3"
      >
        <XStack flexWrap="wrap" justify="space-between" items="center" gap="3">
          {/* Left: Agent Info */}
          <XStack items="center" gap="3" flex={1} minW={280}>
            <YStack
              width={38}
              height={38}
              rounded="6"
              bg="color-4"
              items="center"
              justify="center"
              borderWidth={0.5}
              borderColor="border-color"
            >
              <Bot size={20} color="var(--color-11)" />
            </YStack>

            <YStack gap="0-5" flex={1}>
              <XStack items="center" gap="2">
                <SizableText size="4" fontWeight="700" color="color-12">
                  Generate themes with your AI agent
                </SizableText>
                <XStack bg="color-4" px="2" py="0-5" rounded="3" items="center">
                  <Paragraph size="1" color="color-11" fontWeight="600">
                    v3 Skill
                  </Paragraph>
                </XStack>
              </XStack>
              <Paragraph size="3" color="color-10">
                Copy our recommended skill to generate themes with Claude Code, Cursor, or
                Codex, then preview instantly via URL.
              </Paragraph>
            </YStack>
          </XStack>

          {/* Right: Actions */}
          <XStack items="center" gap="2" flexWrap="wrap">
            <Theme name="accent">
              <Button
                size="md"
                rounded="6"
                icon={copied ? Check : Copy}
                onPress={copySkill}
              >
                {copied ? 'Copied Skill!' : 'Copy Agent Skill'}
              </Button>
            </Theme>

            <Button
              size="md"
              rounded="6"
              variant="outlined"
              onPress={() => setSkillOpen(true)}
            >
              View Skill
            </Button>

            <Button
              size="md"
              rounded="6"
              variant="outlined"
              onPress={() => setImportOpen(true)}
            >
              Preview URL / JSON
            </Button>

            <RandomizeButton />

            <ThemeToggle />
          </XStack>
        </XStack>

        {/* Quick Preset Selector & Status */}
        <XStack items="center" justify="space-between" flexWrap="wrap" gap="2" pt="1">
          <XStack items="center" gap="2" flexWrap="wrap">
            <Paragraph
              size="2"
              color="color-10"
              fontWeight="600"
              textTransform="uppercase"
            >
              Quick Presets:
            </Paragraph>
            {THEME_PRESETS.map((p) => {
              const isActive = activePreset === p.name
              return (
                <XStack
                  key={p.name}
                  items="center"
                  gap="1-5"
                  px="2-5"
                  py="1"
                  rounded="4"
                  bg={isActive ? 'color-4' : 'color-1 hover:color-3'}
                  borderColor={isActive ? 'color-9' : 'border-color'}
                  borderWidth={0.5}
                  style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
                  onPress={() => handleApplyPreset(p)}
                >
                  <YStack width={8} height={8} rounded="2" bg={p.dot as any} />
                  <Paragraph
                    size="2"
                    fontWeight={isActive ? '600' : '400'}
                    color={isActive ? 'color-12' : 'color-11'}
                  >
                    {p.name}
                  </Paragraph>
                </XStack>
              )
            })}
          </XStack>

          {store.currentQuery ? (
            <XStack items="center" gap="2" bg="color-3" px="2-5" py="1" rounded="4">
              <Paragraph size="2" color="color-11">
                Previewing:{' '}
                <SizableText size="2" fontWeight="600" color="color-12">
                  {store.currentQuery}
                </SizableText>
              </Paragraph>
              <Paragraph
                size="2"
                color="color-10"
                style={{ cursor: 'pointer', textDecoration: 'underline' }}
                onPress={() => {
                  store.reset()
                  setActivePreset('Violet')
                }}
              >
                Reset
              </Paragraph>
            </XStack>
          ) : null}
        </XStack>
      </YStack>

      {/* View Skill Modal */}
      <Dialog open={isSkillOpen} onOpenChange={setSkillOpen}>
        <Dialog.Portal>
          <Dialog.Overlay transition="quick" opacity="0.5 enter:0 exit:0" />
          <Dialog.Content
            bordered
            elevate
            key="content"
            transition={{
              preset: 'quickest',
              opacity: { preset: 'quickest', spring: { overshootClamping: true } },
            }}
            x="0 enter:0 exit:0"
            scale="1 enter:0.9 exit:0.95"
            opacity="1 enter:0 exit:0"
            y="0 enter:-20px exit:10px"
            gap="4"
            width={720}
            maxW="92vw"
            maxH="85vh"
            p="5"
          >
            <Dialog.Title size="6">Tamagui Theme Generator Agent Skill</Dialog.Title>
            <Dialog.Description size="3" color="color-10">
              Pass this skill to Claude Code, Cursor, Codex, or Copilot to allow your
              agent to generate themes and open live previews.
            </Dialog.Description>

            <ScrollView
              maxH={420}
              bg="color-1"
              p="3"
              rounded="4"
              borderWidth={0.5}
              borderColor="border-color"
            >
              <Paragraph fontFamily="mono" size="2" whiteSpace="pre-wrap">
                {AGENT_THEME_SKILL_TEXT}
              </Paragraph>
            </ScrollView>

            <XStack justify="flex-end" gap="2">
              <Theme name="accent">
                <Button icon={copied ? Check : Copy} onPress={copySkill}>
                  {copied ? 'Copied!' : 'Copy Skill'}
                </Button>
              </Theme>
              <Dialog.Close asChild>
                <Button>Done</Button>
              </Dialog.Close>
            </XStack>

            <Dialog.Close asChild>
              <TButton
                position="absolute"
                top="3"
                right="3"
                size="sm"
                circular
                icon={X}
              />
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>

      {/* Import / Preview URL Modal */}
      <Dialog open={isImportOpen} onOpenChange={setImportOpen}>
        <Dialog.Portal>
          <Dialog.Overlay transition="quick" opacity="0.5 enter:0 exit:0" />
          <Dialog.Content
            bordered
            elevate
            key="content"
            transition="quick"
            gap="4"
            width={600}
            maxW="92vw"
            p="5"
          >
            <Dialog.Title size="6">Preview Theme Config</Dialog.Title>
            <Dialog.Description size="3" color="color-10">
              Paste a theme preview URL (with #theme=...), raw base64 string, or theme
              JSON:
            </Dialog.Description>

            <Input
              value={importInput}
              onChangeText={setImportInput}
              placeholder="https://tamagui.dev/theme#theme=... or { name: '...' }"
              size="lg"
            />

            <XStack justify="space-between" items="center">
              <Paragraph size="2" color="color-10">
                Tip: Run{' '}
                <SizableText size="2" color="color-11" fontFamily="mono">
                  tamagui preview-theme ./theme.json
                </SizableText>{' '}
                in CLI.
              </Paragraph>
              <XStack gap="2">
                <Dialog.Close asChild>
                  <Button variant="outlined">Cancel</Button>
                </Dialog.Close>
                <Theme name="accent">
                  <Button onPress={handleApplyImport}>Apply Preview</Button>
                </Theme>
              </XStack>
            </XStack>

            <Dialog.Close asChild>
              <TButton
                position="absolute"
                top="3"
                right="3"
                size="sm"
                circular
                icon={X}
              />
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </YStack>
  )
})

export const StudioAIBar = StudioThemeAgentBar
