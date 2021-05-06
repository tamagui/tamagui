import React from 'react'

import { usePopover } from '../hooks/usePopover'
import { Modal } from './Modal'
import { PopoverProps } from './PopoverProps'

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
