import { DocSearchModal } from '@docsearch/react'
import { ArrowRight, Compass, Cpu, Layers, Search as SearchIcon } from '@tamagui/feather-icons'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Button, ButtonProps, Paragraph, isTouchDevice } from 'tamagui'

const SearchContext = createContext<any>(null)

const ACTION_KEY_DEFAULT = ['Ctrl ', 'Control']
const ACTION_KEY_APPLE = ['⌘', 'Command']
const API_KEY = '701b99fa55d34c0875a49ec724bc8c6f'
const APP_ID = 'AIE0I4P8ZS'
const INDEX = 'tamagui'

export function SearchProvider({ children }) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [initialQuery, setInitialQuery] = useState(null)

  const onInput = useCallback(
    (e: any) => {
      setIsOpen(true)
      setInitialQuery(e.key)
    },
    [setIsOpen, setInitialQuery]
  )
  const onOpen = useCallback(() => setIsOpen(true), [setIsOpen])
  const onClose = useCallback(() => setIsOpen(false), [setIsOpen])

  useSearchKeyboard({
    isOpen,
    onOpen,
    onClose,
    onInput,
  })

  const contextValue = useMemo(
    () => ({
      isOpen,
      onOpen,
      onClose,
      onInput,
    }),
    [isOpen, onOpen, onClose, onInput]
  )

  return (
    <>
      <Head>
        <link rel="preconnect" href={`https://${APP_ID}-dsn.algolia.net`} crossOrigin="true" />
      </Head>
      <SearchContext.Provider value={contextValue}>{children}</SearchContext.Provider>
      {isOpen &&
        createPortal(
          <DocSearchModal
            placeholder="Search docs..."
            hitComponent={ResultItem}
            searchParameters={searchParams}
            initialQuery={initialQuery || ''}
            initialScrollY={window.scrollY}
            onClose={onClose}
            appId={APP_ID}
            apiKey={API_KEY}
            indexName={INDEX}
            navigator={{
              navigate({ itemUrl }) {
                console.log('navigate', itemUrl)
                setIsOpen(false)
                router.push(itemUrl)
              },
            }}
            transformItems={(items) => {
              return items.map((item, index) => {
                const aEl = document.createElement('a')
                aEl.href = item.url
                const hash = aEl.hash
                return {
                  ...item,
                  url: `${aEl.pathname}${hash}`,
                  isResult: () => true,
                  isParent: () => item.type === 'lvl1' && items.length > 1 && index === 0,
                  isChild: () =>
                    items.length > 1 &&
                    items[0].type === 'lvl1' &&
                    item.type !== 'lvl1' &&
                    index !== 0,
                  isFirst: () => index === 1,
                  isLast: () => index === items.length - 1 && index !== 0,
                }
              })
            }}
          />,
          document.body
        )}
    </>
  )
}

const searchParams = {
  facetFilters: 'version:v3',
  distinct: 1,
}

const ResultItem = ({ hit, children }) => {
  const isResult = hit.isResult?.()
  const isParent = hit.isParent?.()
  const isFirstChild = hit.isFirst?.()
  const isLastChild = hit.isLast?.()
  const isChild = hit.isChild?.()
  return (
    <Link href={hit.url}>
      <Paragraph tag="a">{children}</Paragraph>
    </Link>
  )
}

export const SearchButton = (props: ButtonProps) => {
  const { onOpen, onInput } = useContext(SearchContext)
  const ref = useRef()

  useEffect(() => {
    const onKeyDown = (event: any) => {
      if (!ref || ref.current !== document.activeElement || !onInput) {
        return
      }
      if (!/[a-zA-Z0-9]/.test(String.fromCharCode(event.keyCode))) {
        return
      }
      onInput(event)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [onInput, ref])

  return (
    <Button
      ref={ref as any}
      onPress={onOpen}
      // className="all ease-in ms100"
      jc="flex-start"
      borderWidth={0.5}
      textAlign="left"
      icon={SearchIcon}
      elevation="$1"
      color="$colorTranslucent"
      hoverStyle={{
        elevation: '$4',
      }}
      iconAfter={
        isTouchDevice ? null : (
          <Button tag="span" size="$2" theme="alt2" hoverable={false}>
            /
          </Button>
        )
      }
      {...props}
      borderRadius={1000}
    />
  )
}

const useSearchKeyboard = ({ isOpen, onOpen, onClose }: any) => {
  useEffect(() => {
    const onKeyDown = (event: any) => {
      function open() {
        if (!document.body.classList.contains('DocSearch--active')) {
          onOpen()
        }
      }
      if (
        (isOpen && event.keyCode === 27) ||
        (event.key === 'k' && (event.metaKey || event.ctrlKey)) ||
        (!isFocusedSomewhere(event) && event.key === '/' && !isOpen)
      ) {
        event.preventDefault()

        if (isOpen) {
          onClose()
        } else if (!document.body.classList.contains('DocSearch--active')) {
          open()
        }
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen, onOpen, onClose])
}

const isFocusedSomewhere = (event: any) => {
  let element = event.target
  let tagName = element.tagName
  return (
    element.isContentEditable ||
    tagName === 'INPUT' ||
    tagName === 'SELECT' ||
    tagName === 'TEXTAREA'
  )
}
