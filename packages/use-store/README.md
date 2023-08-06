# @tamagui/use-store

Simplish reactive classes in react. It doesn't do granular deep object reaction, just the top level set.

```tsx
import { createUseStore, createStoreInstance, useStore, useGlobalStore } from '@tamagui/use-store'

class X {
  y = 0

  add() {
    this.y += 1
  }
}

// Can use it a few ways, all these will access *the same* store:
const useX = createUseStore(X)
const x = createStoreInstance(X)

// all of these will be reactive, so only props you use cause re-renders
export function ReactComponent() {
  const x0 = useStore(X)
  const x1 = useX()
  const x2 = useGlobalStore(x)
  
  return (
    <>
      <div>{x0.y}</div>
      <button action={x0.add}>add</button>
    </>
  )
}

// if you want a different instance or namespace, pass props, these will also all access the same store:
export function ReactComponentAlt() {
  const x0 = useStore(X, { id: 100 })
  const x1 = useX({ id: 100 })
  const x2 = useGlobalStore(x, { id: 100 })
  
  return (
    <div>{x0.y}</div>
  )
}

// finally, you can make selectors with
export function ReactComponentAlt() {
  const xplusten0 = useStoreSelector(X, { id: 100 }, x => x.y + 10)
  const xplusten1 = useGlobalStoreSelector(X, { id: 100 }, x => x.y + 10)

  return (
    <div>{xplusten}</div>
  )
}
```

---

TODO

- usePortal


Better selectors/reactions:

- useSelector
- reaction

Basically make them not tied to one store:

```tsx
const isValid = useStoreSelector(() => {
  return mapStore.isActive && homeStore.isActive
})
```

Same with reaction:

```tsx
useEffect(() => {
  return reaction(
    () => {
      return homeStore.isActive && mapStore.isActive
    },
    isValid => {
      // ...
    }
  )
}, [])
```

Note it does shallow compare.
