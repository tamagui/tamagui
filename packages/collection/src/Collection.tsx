import { useComposedRefs } from '@tamagui/compose-refs'
import { isWeb } from '@tamagui/constants'
import type { ScopedProps, TamaguiElement } from '@tamagui/core'
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
    collectionRef: React.RefObject<CollectionElement>
    itemMap: Map<
      React.RefObject<ItemElement>,
      { ref: React.RefObject<ItemElement> } & ItemData
    >
  }

  type ScopedCollectionProps<P> = ScopedProps<P, 'Collection'>

  const { Provider: CollectionProviderImpl, useStyledContext: useCollectionContext } =
    createStyledContext<ContextValue>({
      collectionRef: { current: null },
      itemMap: new Map(),
    })

  const CollectionProvider: React.FC<{
    children?: React.ReactNode
    __scopeCollection: string
  }> = (props) => {
    const { __scopeCollection, children } = props
    const ref = React.useRef<CollectionElement>(null)
    const itemMap = React.useRef<ContextValue['itemMap']>(new Map()).current
    return (
      <CollectionProviderImpl
        scope={__scopeCollection}
        itemMap={itemMap}
        collectionRef={ref}
      >
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
    CollectionElement,
    ScopedCollectionProps<CollectionProps>
  >((props, forwardedRef) => {
    const { __scopeCollection, children } = props
    const context = useCollectionContext(__scopeCollection)
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
    ItemElement,
    ScopedCollectionProps<CollectionItemSlotProps>
  >((props, forwardedRef) => {
    const { __scopeCollection, children, ...itemData } = props
    const ref = React.useRef<ItemElement>(null)
    const composedRefs = useComposedRefs(forwardedRef, ref)
    const context = useCollectionContext(__scopeCollection)

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

  function useCollection(__scopeCollection: any) {
    const context = useCollectionContext(__scopeCollection)

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
