import { useComposedRefs } from '@tamagui/compose-refs'
import { isWeb } from '@tamagui/constants'
import type { TamaguiElement } from '@tamagui/core'
import { Slot, createStyledContext } from '@tamagui/core'
import React from 'react'

type SlotProps = React.ComponentPropsWithoutRef<typeof Slot>
type CollectionElement = TamaguiElement
interface CollectionProps extends SlotProps {}

// We have resorted to returning slots directly rather than exposing primitives that can then
// be slotted like `<CollectionItem as={Slot}>…</CollectionItem>`.
// This is because we encountered issues with generic types that cannot be statically analysed
// due to creating them dynamically via createCollection.

function createCollection<ItemElement extends TamaguiElement, ItemData = {}>(
  name: string
) {
  /* -----------------------------------------------------------------------------------------------
   * CollectionProvider
   * ---------------------------------------------------------------------------------------------*/

  // const PROVIDER_NAME = name + 'CollectionProvider'
  // const [createCollectionContext, createCollectionScope] =
  //   createContextScope(PROVIDER_NAME)

  type ContextValue = {
    collectionRef: React.RefObject<CollectionElement | undefined>
    itemMap: Map<
      React.RefObject<ItemElement | undefined>,
      { ref: React.RefObject<ItemElement | undefined> } & ItemData
    >
  }

  type ScopedCollectionProps<P> = P & { scope?: any }

  const { Provider: CollectionProviderImpl, useStyledContext: useCollectionContext } =
    createStyledContext<ContextValue>(
      {
        collectionRef: { current: undefined },
        itemMap: new Map(),
      },
      'Toast'
    )

  const CollectionProvider: React.FC<
    ScopedCollectionProps<{
      children?: React.ReactNode
    }>
  > = (props) => {
    const { scope, children } = props
    const ref = React.useRef<CollectionElement>(undefined)
    const itemMap = React.useRef<ContextValue['itemMap']>(new Map()).current
    return (
      <CollectionProviderImpl scope={scope} itemMap={itemMap} collectionRef={ref}>
        {children}
      </CollectionProviderImpl>
    )
  }

  CollectionProvider.displayName = 'CollectionProvider'

  /* -----------------------------------------------------------------------------------------------
   * CollectionSlot
   * ---------------------------------------------------------------------------------------------*/

  const COLLECTION_SLOT_NAME = name + 'CollectionSlot'

  const CollectionSlot = React.forwardRef<
    CollectionElement | undefined,
    ScopedCollectionProps<CollectionProps>
  >((props, forwardedRef) => {
    const { scope, children } = props
    const context = useCollectionContext(scope)
    const composedRefs = useComposedRefs(forwardedRef, context.collectionRef)
    return <Slot ref={composedRefs}>{children}</Slot>
  })

  CollectionSlot.displayName = COLLECTION_SLOT_NAME

  /* -----------------------------------------------------------------------------------------------
   * CollectionItem
   * ---------------------------------------------------------------------------------------------*/

  const ITEM_SLOT_NAME = name + 'CollectionItemSlot'
  const ITEM_DATA_ATTR = 'data-collection-item'

  type CollectionItemSlotProps = ItemData & {
    children: React.ReactNode
  }

  const CollectionItemSlot = React.forwardRef<
    ItemElement | undefined,
    ScopedCollectionProps<CollectionItemSlotProps>
  >((props, forwardedRef) => {
    const { scope, children, ...itemData } = props
    const ref = React.useRef<ItemElement>(undefined)
    const composedRefs = useComposedRefs(forwardedRef, ref)
    const context = useCollectionContext(scope)

    React.useEffect(() => {
      context.itemMap.set(ref, { ref, ...(itemData as unknown as ItemData) })
      return () => void context.itemMap.delete(ref)
    })

    return (
      <Slot {...{ [ITEM_DATA_ATTR]: '' }} ref={composedRefs}>
        {children}
      </Slot>
    )
  })

  CollectionItemSlot.displayName = ITEM_SLOT_NAME

  /* -----------------------------------------------------------------------------------------------
   * useCollection
   * ---------------------------------------------------------------------------------------------*/

  function useCollection(scope: string) {
    const context = useCollectionContext(scope)

    const getItems = React.useCallback(() => {
      if (!isWeb) {
        return []
      }

      const collectionNode = context.collectionRef.current as HTMLElement
      if (!collectionNode) return []
      const orderedNodes = Array.from(
        collectionNode.querySelectorAll(`[${ITEM_DATA_ATTR}]`)
      )
      const items = Array.from(context.itemMap.values())
      const orderedItems = items.sort(
        (a, b) =>
          orderedNodes.indexOf(a.ref.current! as HTMLElement) -
          orderedNodes.indexOf(b.ref.current! as HTMLElement)
      )
      return orderedItems
    }, [context.collectionRef, context.itemMap])

    return getItems
  }

  return [
    { Provider: CollectionProvider, Slot: CollectionSlot, ItemSlot: CollectionItemSlot },
    useCollection,
  ] as const
}

export { createCollection }
export type { CollectionProps }
