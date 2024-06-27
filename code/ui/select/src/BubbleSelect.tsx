import { useComposedRefs } from '@tamagui/compose-refs'
import { usePrevious } from '@tamagui/use-previous'
import * as React from 'react'

/* -----------------------------------------------------------------------------------------------*/
const BubbleSelect = React.forwardRef<
  HTMLSelectElement,
  React.ComponentPropsWithoutRef<'select'>
>((props, forwardedRef) => {
  const { value, ...selectProps } = props
  const ref = React.useRef<HTMLSelectElement>(null)
  const composedRefs = useComposedRefs(forwardedRef, ref)
  const prevValue = usePrevious(value)

  // Bubble value change to parents (e.g form change event)
  React.useEffect(() => {
    const select = ref.current!
    const selectProto = window.HTMLSelectElement.prototype
    const descriptor = Object.getOwnPropertyDescriptor(
      selectProto,
      'value'
    ) as PropertyDescriptor
    const setValue = descriptor.set
    if (prevValue !== value && setValue) {
      const event = new Event('change', { bubbles: true })
      setValue.call(select, value)
      select.dispatchEvent(event)
    }
  }, [prevValue, value])

  /**
   * We purposefully use a `select` here to support form autofill as much
   * as possible.
   *
   * We purposefully do not add the `value` attribute here to allow the value
   * to be set programatically and bubble to any parent form `onChange` event.
   * Adding the `value` will cause React to consider the programatic
   * dispatch a duplicate and it will get swallowed.
   *
   * We use `VisuallyHidden` rather than `display: "none"` because Safari autofill
   * won't work otherwise.
   */
  // TODO
  return null
  // return (
  //   <VisuallyHidden asChild>
  //     <select {...selectProps} ref={composedRefs} defaultValue={value} />
  //   </VisuallyHidden>
  // )
})
