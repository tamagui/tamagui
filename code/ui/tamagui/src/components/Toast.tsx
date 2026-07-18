// Styled Toast (v2 composable API) = the unstyled @tamagui/toast/v2 behavior +
// the default v2-look skin, layered here in `tamagui`. Single skin definition;
// the shadcn registry item is generated from this file. Because the v2 behavior
// renders its default toast content internally, the styled default content lives
// HERE and is wired through Toast.List's `renderItem`, so the copy-paste registry
// item is a complete, customizable toast (no hidden styling in the behavior pkg).
//
// Surfaced at the `tamagui/toast` subpath (not the main entry) because the main
// entry's `export * from '@tamagui/toast'` already occupies the `Toast` name with
// the v1 imperative API.
import {
  Toast as ToastBehavior,
  toast,
  useToastItem,
  useToasts,
  type ExternalToast,
  type ToastItemRenderProps,
  type ToastListProps,
  type ToastPosition,
  type ToastT,
  type ToasterPosition,
  type ToasterProps,
} from '@tamagui/toast/v2'
import {
  createRefComponent,
  SizableText,
  styled,
  type TamaguiElement,
  withStaticProperties,
  XStack,
  YStack,
} from '@tamagui/ui'

/* -------------------------------------------------------------------------------------------------
 * Styled parts — the v2-look skin over the unstyled @tamagui/toast/v2 primitives.
 * -----------------------------------------------------------------------------------------------*/

export const ToastItem = styled(ToastBehavior.Item, {
  name: 'ToastItem',
  backgroundColor: '$background',
  borderRadius: '$6',
  paddingHorizontal: '$4',
  paddingVertical: '$3',
  borderWidth: 1,
  borderColor: '$borderColor',
  shadowColor: 'rgba(0, 0, 0, 0.15)',
  shadowOffset: { width: 0, height: 4 },
  shadowRadius: 12,
  focusVisibleStyle: {
    outlineWidth: 2,
    outlineColor: '$color8',
    outlineStyle: 'solid',
  },
})

export const ToastTitle = styled(ToastBehavior.Title, {
  name: 'ToastTitle',
  color: '$color',
  fontWeight: '600',
  size: '$4',
})

export const ToastDescription = styled(ToastBehavior.Description, {
  name: 'ToastDescription',
  color: '$color11',
  size: '$2',
})

export const ToastClose = styled(ToastBehavior.Close, {
  name: 'ToastClose',
  borderRadius: '$10',
  backgroundColor: '$background',
  borderWidth: 1,
  borderColor: '$borderColor',
  shadowColor: 'rgba(0, 0, 0, 0.08)',
  shadowOffset: { width: 0, height: 1 },
  shadowRadius: 3,
  hoverStyle: { backgroundColor: '$color3' },
  pressStyle: { backgroundColor: '$color4' },
})

export const ToastAction = styled(ToastBehavior.Action, {
  name: 'ToastAction',
  borderRadius: '$2',
  paddingHorizontal: '$2',
  backgroundColor: '$color5',
  hoverStyle: { backgroundColor: '$color6' },
  pressStyle: { backgroundColor: '$color7' },
})

/* -------------------------------------------------------------------------------------------------
 * ToastDefaultContent — the default toast body (icon / title / description /
 * actions / close), styled. Rendered via Toast.List's renderItem below.
 * -----------------------------------------------------------------------------------------------*/

function ToastDefaultContent({ toast: t }: { toast: ToastT }) {
  const { closeButton } = useToasts()
  const { handleClose } = useToastItem()
  const dismissible = t.dismissible !== false

  const title = typeof t.title === 'function' ? t.title() : t.title
  const description =
    typeof t.description === 'function' ? t.description() : t.description

  return (
    <XStack alignItems="flex-start" gap="$3">
      <ToastBehavior.Icon />

      <YStack flex={1} gap="$1">
        {title ? <ToastTitle>{title}</ToastTitle> : null}
        {description ? <ToastDescription>{description}</ToastDescription> : null}

        {t.action || t.cancel ? (
          <XStack gap="$2" marginTop="$2">
            {t.cancel ? (
              <ToastAction
                backgroundColor="transparent"
                onPress={(e: any) => {
                  t.cancel?.onClick?.(e)
                  handleClose()
                }}
              >
                <SizableText size="$2" color="$color11">
                  {t.cancel.label}
                </SizableText>
              </ToastAction>
            ) : null}
            {t.action ? (
              <ToastAction
                backgroundColor="$color12"
                hoverStyle={{ backgroundColor: '$color11' }}
                pressStyle={{ backgroundColor: '$color10' }}
                onPress={(e: any) => {
                  t.action?.onClick?.(e)
                  if (!(e as any).defaultPrevented) {
                    handleClose()
                  }
                }}
              >
                <SizableText size="$2" fontWeight="600" color="$background">
                  {t.action.label}
                </SizableText>
              </ToastAction>
            ) : null}
          </XStack>
        ) : null}
      </YStack>

      {closeButton && dismissible ? <ToastClose /> : null}
    </XStack>
  )
}

const renderStyledToast = ({ toast: t, index }: ToastItemRenderProps) => (
  <ToastItem toast={t} index={index}>
    <ToastDefaultContent toast={t} />
  </ToastItem>
)

// Styled list — defaults renderItem to the styled default content so the
// composable `<Toast.List />` and `<Toaster />` are styled by default; a
// consumer-supplied renderItem still overrides it.
function ToastList(props: ToastListProps) {
  return <ToastBehavior.List renderItem={renderStyledToast} {...props} />
}

/* -------------------------------------------------------------------------------------------------
 * Toast — the styled composable API (styled parts on the behavior root).
 * -----------------------------------------------------------------------------------------------*/

export const Toast = withStaticProperties(ToastBehavior, {
  Viewport: ToastBehavior.Viewport,
  List: ToastList,
  Item: ToastItem,
  Title: ToastTitle,
  Description: ToastDescription,
  Close: ToastClose,
  Action: ToastAction,
  Icon: ToastBehavior.Icon,
})

/* -------------------------------------------------------------------------------------------------
 * Toaster — drop-in all-in-one, styled. Mirrors the behavior Toaster composition
 * but renders the styled default content via renderItem.
 * -----------------------------------------------------------------------------------------------*/

export const Toaster = createRefComponent<TamaguiElement, ToasterProps>(
  function Toaster(props, ref) {
    const {
      position = 'bottom-right',
      expand = false,
      visibleToasts,
      gap,
      duration,
      offset,
      hotkey,
      swipeDirection,
      swipeThreshold,
      closeButton,
      theme,
      icons,
      toastOptions,
      containerAriaLabel = 'Notifications',
      native,
      burntOptions,
      notificationOptions,
      reducedMotion,
    } = props

    return (
      <ToastBehavior
        position={position}
        expand={expand}
        visibleToasts={visibleToasts}
        gap={gap}
        duration={toastOptions?.duration ?? duration}
        swipeDirection={swipeDirection}
        swipeThreshold={swipeThreshold}
        closeButton={closeButton}
        theme={theme}
        icons={icons}
        native={native}
        burntOptions={burntOptions}
        notificationOptions={notificationOptions}
        reducedMotion={reducedMotion}
      >
        <ToastBehavior.Viewport
          ref={ref}
          offset={offset}
          hotkey={hotkey}
          label={containerAriaLabel}
        >
          <ToastList />
        </ToastBehavior.Viewport>
      </ToastBehavior>
    )
  }
)

Toaster.displayName = 'Toaster'

// Re-export the non-visual v2 surface so `tamagui/toast` is a drop-in for the
// styled toast: imperative API, render hooks, and the public types.
export { toast, useToastItem, useToasts }
export type { ExternalToast, ToastPosition, ToastT, ToasterPosition, ToasterProps }
