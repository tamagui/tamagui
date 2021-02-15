import React from 'react'

import { Modal } from './Modal'
import { PopoverProps } from './PopoverProps'
import { usePopover } from './usePopover'

// not implemented beyond controlled

export function Popover(props: PopoverProps) {
  const { isMounted } = usePopover(props)

  if (isMounted && props.isOpen) {
    return (
      <>
        {props.children}
        <Modal transparent={false} presentationStyle="formSheet" visible>
          {props.contents}
        </Modal>
      </>
    )
  }

  return props.children
}
