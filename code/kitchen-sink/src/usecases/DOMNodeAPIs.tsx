import { useEffect, useRef, useState } from 'react'
import { ScrollView, Text, View, YStack, XStack, Input } from 'tamagui'

// exercises the RN 0.82 DOM Node APIs through tamagui component refs
// on web these are native DOM APIs, on native they're the new DOM-compatible shim

type Results = Record<string, string>

export function DOMNodeAPIs() {
  const parentRef = useRef<HTMLElement>(null)
  const childARef = useRef<HTMLElement>(null)
  const childBRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLElement>(null)
  const scrollRef = useRef<HTMLElement>(null)
  const inputRef = useRef<HTMLElement>(null)
  const [results, setResults] = useState<Results>({})

  useEffect(() => {
    // wait a frame so layout is settled
    requestAnimationFrame(() => {
      const parent = parentRef.current
      const childA = childARef.current
      const childB = childBRef.current
      const textEl = textRef.current
      const scrollEl = scrollRef.current
      const inputEl = inputRef.current

      if (!parent || !childA || !childB || !textEl || !scrollEl || !inputEl) {
        setResults({ error: 'refs not attached' })
        return
      }

      const r: Results = {}

      // tree traversal
      r['parentNode-exists'] = String(!!childA.parentNode)
      r['parentElement-exists'] = String(!!childA.parentElement)
      r['parent-contains-childA'] = String(parent.contains(childA))
      r['parent-contains-childB'] = String(parent.contains(childB))
      r['childA-contains-parent'] = String(childA.contains(parent))
      r['hasChildNodes'] = String(parent.hasChildNodes())
      r['childNodes-length'] = String(parent.childNodes.length)
      r['children-length'] = String(parent.children.length)
      r['firstChild-exists'] = String(!!parent.firstChild)
      r['lastChild-exists'] = String(!!parent.lastChild)
      r['firstElementChild-exists'] = String(!!parent.firstElementChild)
      r['lastElementChild-exists'] = String(!!parent.lastElementChild)

      // sibling traversal
      r['childA-nextSibling-exists'] = String(!!childA.nextSibling)
      r['childB-previousSibling-exists'] = String(!!childB.previousSibling)
      r['childA-nextElementSibling-exists'] = String(!!childA.nextElementSibling)
      r['childB-previousElementSibling-exists'] = String(!!childB.previousElementSibling)

      // getBoundingClientRect
      const rect = parent.getBoundingClientRect()
      r['rect-has-width'] = String(rect.width > 0)
      r['rect-has-height'] = String(rect.height > 0)
      r['rect-has-x'] = String(typeof rect.x === 'number')
      r['rect-has-y'] = String(typeof rect.y === 'number')
      r['rect-has-top'] = String(typeof rect.top === 'number')
      r['rect-has-left'] = String(typeof rect.left === 'number')
      r['rect-has-right'] = String(typeof rect.right === 'number')
      r['rect-has-bottom'] = String(typeof rect.bottom === 'number')

      // document access
      r['ownerDocument-exists'] = String(!!parent.ownerDocument)
      r['isConnected'] = String(parent.isConnected)

      // getElementById via ownerDocument
      r['getElementById-works'] = String(
        !!parent.ownerDocument.getElementById('dom-node-childA')
      )

      // compareDocumentPosition
      const pos = parent.compareDocumentPosition(childA)
      // DOCUMENT_POSITION_CONTAINED_BY = 16, DOCUMENT_POSITION_FOLLOWING = 4
      r['compareDocumentPosition-contained'] = String((pos & 16) !== 0)

      // nodeType / nodeName
      r['parent-nodeType'] = String(parent.nodeType)
      r['parent-nodeName-exists'] = String(!!parent.nodeName)

      // textContent
      r['text-textContent'] = textEl.textContent || ''

      // offset properties
      r['offsetWidth-positive'] = String(parent.offsetWidth > 0)
      r['offsetHeight-positive'] = String(parent.offsetHeight > 0)
      r['offsetParent-exists'] = String(!!parent.offsetParent)

      // client properties
      r['clientWidth-positive'] = String(parent.clientWidth > 0)
      r['clientHeight-positive'] = String(parent.clientHeight > 0)

      // childElementCount
      r['childElementCount'] = String(parent.childElementCount)

      // getRootNode
      r['getRootNode-exists'] = String(!!parent.getRootNode())

      // focus/blur (just verify they exist and don't throw)
      try {
        inputEl.focus()
        r['focus-works'] = String(document.activeElement === inputEl)
        inputEl.blur()
        r['blur-works'] = String(document.activeElement !== inputEl)
      } catch {
        r['focus-works'] = 'false'
        r['blur-works'] = 'false'
      }

      setResults(r)
    })
  }, [])

  return (
    <YStack padding="$4" gap="$2">
      <View ref={parentRef as any} id="dom-node-parent" gap="$2">
        <View
          ref={childARef as any}
          id="dom-node-childA"
          width={100}
          height={50}
          backgroundColor="$blue5"
        />
        <View
          ref={childBRef as any}
          id="dom-node-childB"
          width={100}
          height={50}
          backgroundColor="$red5"
        />
        <Text ref={textRef as any} id="dom-node-text">
          hello dom
        </Text>
        <ScrollView ref={scrollRef as any} id="dom-node-scroll" height={60}>
          <View height={200} />
        </ScrollView>
        <Input ref={inputRef as any} id="dom-node-input" placeholder="focusable" />
      </View>

      <YStack id="dom-node-results" gap="$1" paddingTop="$4">
        {Object.entries(results).map(([key, value]) => (
          <XStack key={key} gap="$2">
            <Text fontSize="$2" fontFamily="$mono" data-testid={`result-${key}`}>
              {key}={value}
            </Text>
          </XStack>
        ))}
      </YStack>
    </YStack>
  )
}
