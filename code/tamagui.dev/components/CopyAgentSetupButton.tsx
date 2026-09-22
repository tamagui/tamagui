import { Bot, Check } from '@tamagui/local-icons'
import { TooltipSimple } from 'tamagui'
import { Button, type ButtonProps, type ButtonSize } from '~/components/Button'
import { useClipboard } from '~/hooks/useClipboard'

export const AGENT_SETUP_PROMPT = `Set up Tamagui v3 in this project. Read the docs pages that match my situation before writing any code, and follow them exactly rather than guessing at APIs.

Start here: https://tamagui.dev/docs/intro/introduction

New project:
- https://tamagui.dev/docs/intro/installation

Adding to an existing app, plus the guide for its bundler:
- https://tamagui.dev/docs/intro/installation
- Vite: https://tamagui.dev/docs/guides/vite
- Expo / Metro: https://tamagui.dev/docs/guides/expo
- Next.js: https://tamagui.dev/docs/guides/next-js
- One: https://tamagui.dev/docs/guides/one
- Webpack: https://tamagui.dev/docs/guides/webpack

Upgrading from v1 or v2:
- https://tamagui.dev/docs/guides/how-to-upgrade

Then read these regardless:
- Style syntax: https://tamagui.dev/docs/intro/styles
- Tailwind classNames: https://tamagui.dev/docs/core/tailwind
- Compiler setup: https://tamagui.dev/docs/intro/compiler-install
- Ready-made briefs and the mistakes agents make most: https://tamagui.dev/docs/intro/agents

Tell me which of the three situations you detected before you change anything.`

export const AGENT_UPGRADE_PROMPT = `Upgrade this project to Tamagui v3. Follow the v3 upgrade guide (https://tamagui.dev/docs/guides/how-to-upgrade) and the v3 blog post (https://tamagui.dev/blog/version-three).

Run \`npx tamagui@beta migrate --from v2\` (or \`--from v1\`) and follow the brief it prints. Aim for the intermediate checkpoint: V3 APIs with my existing design values. Identify the package version and config version separately. If I use Config v5 or v5-subtle, keep it; do not move to Config v6, remap its colors or scales, or convert the whole app to html.* or Tailwind in this pass.

Run the flat-values codemod in dry-run first, show me the report, and wait for me to read it before you write anything. Tell me every site the codemod refused and why. After the required API changes, compare the same screens and interactions against the baseline. A working V3 app on Config v5 is a completed upgrade. List optional Config v6 or frontend changes separately; do not begin them automatically.`

export const AGENT_NEW_PROMPT = `Add Tamagui v3 to this project. Run \`npx tamagui@beta setup\` and follow the brief it prints, adapting it to this project's bundler and framework. Do not skip the verification step at the end, and tell me anything you had to skip or guess at.

Docs: https://tamagui.dev/docs/intro/installation`

export const AGENT_PROMPTS = {
  setup: AGENT_SETUP_PROMPT,
  upgrade: AGENT_UPGRADE_PROMPT,
  new: AGENT_NEW_PROMPT,
}

export type CopyAgentSetupButtonProps = {
  type?: 'setup' | 'upgrade' | 'new'
  content?: string
  label?: string
  tooltip?: string
  size?: ButtonSize
} & Omit<ButtonProps, 'type'>

export const CopyAgentSetupButton = ({
  type = 'setup',
  content,
  label,
  tooltip,
  size = 'sm',
  variant = 'outlined',
  children,
  ...props
}: CopyAgentSetupButtonProps) => {
  const promptText = content || AGENT_PROMPTS[type] || AGENT_PROMPTS.setup
  const { hasCopied, onCopy } = useClipboard(promptText)

  const defaultLabel =
    label ||
    (type === 'upgrade'
      ? 'Copy agent upgrade prompt'
      : type === 'new'
        ? 'Copy agent setup prompt'
        : 'Copy agent setup')

  const defaultTooltip =
    tooltip ||
    (type === 'upgrade'
      ? 'Copy the v3 upgrade prompt for your coding agent'
      : 'Copy the v3 setup prompt for your coding agent')

  return (
    <TooltipSimple
      placement="top"
      label={hasCopied ? 'Copied to clipboard' : defaultTooltip}
    >
      <Button
        size={size}
        variant={variant}
        self="flex-start"
        icon={hasCopied ? Check : Bot}
        onPress={() => onCopy()}
        aria-label={hasCopied ? 'Copied' : defaultLabel}
        {...props}
      >
        <Button.Text>{hasCopied ? 'Copied' : children || defaultLabel}</Button.Text>
      </Button>
    </TooltipSimple>
  )
}
