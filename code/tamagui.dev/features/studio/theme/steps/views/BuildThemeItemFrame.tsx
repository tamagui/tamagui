import { X } from '@tamagui/lucide-icons'
import { Button, EnsureFlexed, XStack, YStack } from 'tamagui'

import { rootStore } from '../../../state/RootStore'
import { toastController } from '../../../ToastProvider'
import type { FieldsetWithLabelProps } from '../../views/FieldsetWithLabel'
import { FieldsetWithLabel } from '../../views/FieldsetWithLabel'

export type BuildThemeItemFrameProps = FieldsetWithLabelProps & {
  onDelete?: () => void | Promise<void>
  disabled?: boolean
}

export const BuildThemeItemFrame = ({
  children,
  afterLabel,
  onDelete,
  disabled,
  ...props
}: BuildThemeItemFrameProps) => {
  return (
    <FieldsetWithLabel
      {...props}
      afterLabel={
        <XStack
          gap="$2"
          ai="center"
        >
          {afterLabel}

          {!!onDelete && (
            <Button
              icon={X}
              size="$2"
              circular
              onPress={async () => {
                if (
                  await rootStore.confirmDialog('confirm-delete', {
                    category: '',
                    snippet: '',
                    message: ``,
                  })
                ) {
                  await onDelete()
                  toastController.show(`Deleted!`)
                }
              }}
            />
          )}
        </XStack>
      }
    >
      <YStack
        {...(disabled && {
          o: 0.25,
          pe: 'none',
        })}
        gap="$4"
      >
        {children}
      </YStack>
    </FieldsetWithLabel>
  )
}
