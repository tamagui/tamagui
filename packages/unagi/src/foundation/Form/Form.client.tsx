// @ts-ignore
import { createFromFetch } from '@tamagui/unagi/vendor/react-server-dom-vite'
import React, { FormEvent, useCallback, useState } from 'react'

import { useInternalServerProps } from '../useServerProps.js'

interface FormProps {
  action: string
  method?: string
  children?: Array<React.ReactNode>
  onSubmit?: (e: FormEvent<HTMLFormElement>) => void
  encType?: string
  noValidate?: boolean
}

export function Form({
  action,
  method,
  children,
  onSubmit,
  encType = 'application/x-www-form-urlencoded',
  noValidate,
  ...props
}: FormProps) {
  const { setRscResponseFromApiRoute } = useInternalServerProps()
  const [_, startTransition] = (React as any).useTransition()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const submit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      onSubmit && onSubmit(e)
      if (e.defaultPrevented) return

      setLoading(true)
      e.preventDefault()
      const formData = new FormData(e.target as HTMLFormElement)

      // @ts-expect-error
      // It's valid to pass a FormData instance to a URLSearchParams constructor
      // @todo - support multipart forms
      const formBody = new URLSearchParams(formData)

      startTransition(() => {
        fetch(action, {
          method,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            'Hydrogen-Client': 'Form-Action',
          },
          body: formBody.toString(),
        })
          .then((fetchResponse) => {
            const rscPathname = fetchResponse.headers.get('Hydrogen-RSC-Pathname')

            if (!rscPathname)
              throw new Error(
                `The component's \`action\` attribute must point to an API route that responds with a new Request()\nRead more at https://shopify.dev/custom-storefronts/hydrogen/framework/forms`
              )

            if (rscPathname !== window.location.pathname) {
              window.history.pushState(null, '', rscPathname)
            }
            const rscResponse = createFromFetch(Promise.resolve(fetchResponse))
            setRscResponseFromApiRoute({
              url: method + action,
              response: rscResponse,
            })
            setLoading(false)
          })
          .catch((error) => {
            setError(error)
            setLoading(false)
          })
      })
    },
    [onSubmit, startTransition, action, method, setRscResponseFromApiRoute]
  )

  return (
    <form
      action={action}
      method={method}
      onSubmit={submit}
      encType="application/x-www-form-urlencoded"
      noValidate={noValidate}
      {...props}
    >
      {children instanceof Function ? children({ loading, error }) : children}
    </form>
  )
}
