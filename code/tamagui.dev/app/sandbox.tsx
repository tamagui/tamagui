import { Theme } from '@tamagui/web'
import { useEffect } from 'react'
import { Button } from 'tamagui'
import { NewPurchaseModal } from '../features/site/purchase/NewPurchaseModal'
import { useTakeoutStore } from '../features/site/purchase/useTakeoutStore'

export function Sandbox() {
  const store = useTakeoutStore()

  useEffect(() => {
    store.showPurchase = true
  }, [])

  return (
    <>
      {/* <Theme name="accent">
        <Button>Hello</Button>
      </Theme> */}

      <NewPurchaseModal />

      {/* <Test
        animation="bouncy"
        debug="verbose"
        pressStyle={{
          scale: 2,
        }}
        hoverStyle={{
          scale: 1.5,
        }}
        $platform-web={{
          position: 'fixed',
        }}
      /> */}
    </>
  )
}
