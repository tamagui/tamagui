export const Collapsible = {}

// import { useComposedRefs } from '@tamagui/compose-refs'
// import { Stack, StackProps, TamaguiElement, composeEventHandlers, useId } from '@tamagui/core'
// import type { Scope } from '@tamagui/create-context'
// import { createContextScope } from '@tamagui/create-context'
// // import { Presence } from '@tamagui/react-presence'
// import { useControllableState } from '@tamagui/use-controllable-state'
// import * as React from 'react'

// /* -------------------------------------------------------------------------------------------------
//  * Collapsible
//  * -----------------------------------------------------------------------------------------------*/

// const COLLAPSIBLE_NAME = 'Collapsible'

// type ScopedProps<P> = P & { __scopeCollapsible?: Scope }
// const [createCollapsibleContext, createCollapsibleScope] = createContextScope(COLLAPSIBLE_NAME)

// type CollapsibleContextValue = {
//   contentId: string
//   disabled?: boolean
//   open: boolean
//   onOpenToggle(): void
// }

// const [CollapsibleProvider, useCollapsibleContext] =
//   createCollapsibleContext<CollapsibleContextValue>(COLLAPSIBLE_NAME)

// type CollapsibleElement = TamaguiElement
// interface CollapsibleProps extends StackProps {
//   defaultOpen?: boolean
//   open?: boolean
//   disabled?: boolean
//   onOpenChange?(open: boolean): void
// }

// const Collapsible = React.forwardRef<CollapsibleElement, CollapsibleProps>(
//   (props: ScopedProps<CollapsibleProps>, forwardedRef) => {
//     const {
//       __scopeCollapsible,
//       open: openProp,
//       defaultOpen,
//       disabled,
//       onOpenChange,
//       ...collapsibleProps
//     } = props

//     const [open, setOpen] = useControllableState({
//       prop: openProp,
//       defaultProp: defaultOpen || false,
//       onChange: onOpenChange,
//     })

//     return (
//       <CollapsibleProvider
//         scope={__scopeCollapsible}
//         disabled={disabled}
//         contentId={useId() || ''}
//         open={open}
//         onOpenToggle={React.useCallback(() => setOpen((prevOpen) => !prevOpen), [setOpen])}
//       >
//         <Stack
//           data-state={getState(open)}
//           data-disabled={disabled ? '' : undefined}
//           {...collapsibleProps}
//           ref={forwardedRef}
//         />
//       </CollapsibleProvider>
//     )
//   }
// )

// Collapsible.displayName = COLLAPSIBLE_NAME

// /* -------------------------------------------------------------------------------------------------
//  * CollapsibleTrigger
//  * -----------------------------------------------------------------------------------------------*/

// const TRIGGER_NAME = 'CollapsibleTrigger'

// type CollapsibleTriggerElement = TamaguiElement
// interface CollapsibleTriggerProps extends StackProps {}

// const CollapsibleTrigger = React.forwardRef<CollapsibleTriggerElement, CollapsibleTriggerProps>(
//   (props: ScopedProps<CollapsibleTriggerProps>, forwardedRef) => {
//     const { __scopeCollapsible, ...triggerProps } = props
//     const context = useCollapsibleContext(TRIGGER_NAME, __scopeCollapsible)
//     return (
//       <Stack
//         type="button"
//         aria-controls={context.contentId}
//         aria-expanded={context.open || false}
//         data-state={getState(context.open)}
//         data-disabled={context.disabled ? '' : undefined}
//         disabled={context.disabled}
//         {...triggerProps}
//         ref={forwardedRef}
//         //
//         // onPress={composeEventHandlers(props.onPress, context.onOpenToggle)}
//       />
//     )
//   }
// )

// CollapsibleTrigger.displayName = TRIGGER_NAME

// /* -------------------------------------------------------------------------------------------------
//  * CollapsibleContent
//  * -----------------------------------------------------------------------------------------------*/

// const CONTENT_NAME = 'CollapsibleContent'

// type CollapsibleContentElement = CollapsibleContentImplElement
// interface CollapsibleContentProps extends Omit<CollapsibleContentImplProps, 'present'> {
//   /**
//    * Used to force mounting when more control is needed. Useful when
//    * controlling animation with React animation libraries.
//    */
//   forceMount?: true
// }

// const CollapsibleContent = React.forwardRef<CollapsibleContentElement, CollapsibleContentProps>(
//   (props: ScopedProps<CollapsibleContentProps>, forwardedRef) => {
//     const { forceMount, ...contentProps } = props
//     const context = useCollapsibleContext(CONTENT_NAME, props.__scopeCollapsible)
//     return (
//       // <Presence present={forceMount || context.open}>
//       <>
//         {({ present }) => (
//           <CollapsibleContentImpl {...contentProps} ref={forwardedRef} present={present} />
//         )}
//       </>
//       // </Presence>
//     )
//   }
// )

// CollapsibleContent.displayName = CONTENT_NAME

// /* -----------------------------------------------------------------------------------------------*/

// type CollapsibleContentImplElement = TamaguiElement
// interface CollapsibleContentImplProps extends StackProps {
//   present: boolean
// }

// const CollapsibleContentImpl = React.forwardRef<
//   CollapsibleContentImplElement,
//   CollapsibleContentImplProps
// >((props: ScopedProps<CollapsibleContentImplProps>, forwardedRef) => {
//   const { __scopeCollapsible, present, children, ...contentProps } = props
//   const context = useCollapsibleContext(CONTENT_NAME, __scopeCollapsible)
//   const [isPresent, setIsPresent] = React.useState(present)
//   const ref = React.useRef<CollapsibleContentImplElement>(null)
//   const composedRefs = useComposedRefs(forwardedRef, ref)
//   const heightRef = React.useRef<number | undefined>(0)
//   const height = heightRef.current
//   const widthRef = React.useRef<number | undefined>(0)
//   const width = widthRef.current
//   // when opening we want it to immediately open to retrieve dimensions
//   // when closing we delay `present` to retrieve dimensions before closing
//   const isOpen = context.open || isPresent
//   const isMountAnimationPreventedRef = React.useRef(isOpen)
//   const originalStylesRef = React.useRef<Record<string, string>>()

//   React.useEffect(() => {
//     const rAF = requestAnimationFrame(() => (isMountAnimationPreventedRef.current = false))
//     return () => cancelAnimationFrame(rAF)
//   }, [])

//   // useIsomorphicLayoutEffect(() => {
//   //   const node = ref.current
//   //   if (node) {
//   //     originalStylesRef.current = originalStylesRef.current || {
//   //       transitionDuration: node.style.transitionDuration,
//   //       animationDuration: node.style.animationDuration,
//   //       animationFillMode: node.style.animationFillMode,
//   //     }
//   //     // block any animations/transitions so the element renders at its full dimensions
//   //     node.style.transitionDuration = '0s'
//   //     node.style.animationDuration = '0s'
//   //     node.style.animationFillMode = 'none'

//   //     // get width and height from full dimensions
//   //     const rect = node.getBoundingClientRect()
//   //     heightRef.current = rect.height
//   //     widthRef.current = rect.width

//   //     // kick off any animations/transitions that were originally set up if it isn't the initial mount
//   //     if (!isMountAnimationPreventedRef.current) {
//   //       node.style.transitionDuration = originalStylesRef.current.transitionDuration
//   //       node.style.animationDuration = originalStylesRef.current.animationDuration
//   //       node.style.animationFillMode = originalStylesRef.current.animationFillMode
//   //     }

//   //     setIsPresent(present)
//   //   }
//   //   /**
//   //    * depends on `context.open` because it will change to `false`
//   //    * when a close is triggered but `present` will be `false` on
//   //    * animation end (so when close finishes). This allows us to
//   //    * retrieve the dimensions *before* closing.
//   //    */
//   // }, [context.open, present])

//   return (
//     <Stack
//       data-state={getState(context.open)}
//       data-disabled={context.disabled ? '' : undefined}
//       id={context.contentId}
//       hidden={!isOpen}
//       {...contentProps}
//       // @ts-expect-error
//       ref={composedRefs}
//       // style={{
//       //   [`--radix-collapsible-content-height` as any]: height ? `${height}px` : undefined,
//       //   [`--radix-collapsible-content-width` as any]: width ? `${width}px` : undefined,
//       //   ...props.style,
//       // }}
//     >
//       {isOpen && children}
//     </Stack>
//   )
// })

// /* -----------------------------------------------------------------------------------------------*/

// function getState(open?: boolean) {
//   return open ? 'open' : 'closed'
// }

// const Root = Collapsible
// const Trigger = CollapsibleTrigger
// const Content = CollapsibleContent

// export {
//   createCollapsibleScope,
//   //
//   Collapsible,
//   CollapsibleTrigger,
//   CollapsibleContent,
//   //
//   Root,
//   Trigger,
//   Content,
// }
// export type { CollapsibleProps, CollapsibleTriggerProps, CollapsibleContentProps }
