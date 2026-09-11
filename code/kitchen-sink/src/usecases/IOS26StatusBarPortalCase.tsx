/**
 * Repro for the iOS 26 Safari white status-bar strip: Safari hit-tests the top
 * edge of the viewport, treats a full-viewport position:fixed portal host as a
 * "fixed top container", and colors the status-bar strip from it. A host whose
 * children are all invisible samples as a solid white bar in light appearance.
 *
 * Page shape (per the soot RCA): light html/body background (#e9e9e9), a dark
 * full-height hero, and a CLOSED portal-mounted primitive. Buggy = white strip
 * behind the status area; fixed = strip matches #e9e9e9.
 *
 * Variants via ?variant= (default sheet):
 *   sheet   - closed modal Sheet, content mounted (the main offender)
 *   popover - closed Popover with keepChildrenMounted
 *   dialog  - closed Dialog with keepChildrenMounted
 *   toast   - toast viewport portaled to root, zero toasts
 *   none    - no portal at all (control: strip must match body)
 */

import { Dialog } from '@tamagui/dialog'
import { Popover } from '@tamagui/popover'
import { Toast } from '@tamagui/toast'
import * as React from 'react'
import { Paragraph, Sheet, YStack } from 'tamagui'
import { Button } from '../components/Button'

const BODY_BG = '#e9e9e9'

export function IOS26StatusBarPortalCase() {
  const [open, setOpen] = React.useState(false)
  const params = new URLSearchParams(window.location.search)
  const variant = params.get('variant') || 'sheet'
  // ?baseline=1 forces the pre-fix host shape (portalProps overrides hidden)
  // so the white strip can be reproduced against the same build
  const baseline = params.get('baseline') === '1'

  React.useEffect(() => {
    document.documentElement.style.background = BODY_BG
    document.body.style.background = BODY_BG
    const meta = document.querySelector('meta[name="viewport"]')
    if (meta && !meta.getAttribute('content')?.includes('viewport-fit')) {
      meta.setAttribute('content', `${meta.getAttribute('content')}, viewport-fit=cover`)
    }
  }, [])

  // ?autocycle=1 opens then closes the primitive so the closed-after-open
  // state (exit animation completed) can be captured without driving touches
  const autocycle = params.get('autocycle') === '1'
  React.useEffect(() => {
    if (!autocycle) return
    const t1 = setTimeout(() => setOpen(true), 1000)
    const t2 = setTimeout(() => setOpen(false), 3000)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [autocycle])

  return (
    <>
      {/* dark full-height hero so the strip color is distinguishable from the
          page, in normal flow plus trailing content so the page scrolls like a
          real site */}
      <div style={{ height: '100lvh', background: '#111' }} />
      <div style={{ height: '150vh' }} />

      <YStack position="absolute" top={100} left={20} right={20} zIndex={10} gap="4">
        <Paragraph color="white" data-testid="variant-label">
          variant: {variant}
        </Paragraph>
        <Button data-testid="toggle" onPress={() => setOpen(!open)}>
          {open ? 'Close' : 'Open'}
        </Button>
      </YStack>

      {variant === 'sheet' && (
        <Sheet
          modal
          open={open}
          onOpenChange={setOpen}
          dismissOnSnapToBottom
          snapPoints={[40]}
          {...(baseline && { portalProps: { hidden: false } })}
        >
          <Sheet.Overlay opacity="0.5 enter:0 exit:0" />
          <Sheet.Container padding="4" data-testid="sheet-frame">
            <Sheet.Background bg="background" />
            <Paragraph>closed-by-default sheet content</Paragraph>
            <Button data-testid="sheet-close" onPress={() => setOpen(false)}>
              Close
            </Button>
          </Sheet.Container>
        </Sheet>
      )}

      {variant === 'popover' && (
        <Popover open={open} onOpenChange={setOpen} keepChildrenMounted>
          <Popover.Trigger asChild>
            <Button data-testid="popover-trigger" position="absolute" top={200} left={20}>
              Trigger
            </Button>
          </Popover.Trigger>
          <Popover.Content data-testid="popover-content">
            <Paragraph>kept-mounted popover content</Paragraph>
          </Popover.Content>
        </Popover>
      )}

      {variant === 'dialog' && (
        <Dialog modal open={open} onOpenChange={setOpen} keepChildrenMounted>
          <Dialog.Portal>
            <Dialog.Overlay key="overlay" />
            <Dialog.Content key="content" data-testid="dialog-content">
              <Paragraph>kept-mounted dialog content</Paragraph>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog>
      )}

      {variant === 'toast' && (
        <Toast position="bottom-right">
          <Toast.Viewport>
            <Toast.List />
          </Toast.Viewport>
        </Toast>
      )}
    </>
  )
}
