import { useEffect } from 'react'

import { useNavigate } from '../useNavigate/useNavigate.js'

type RedirectProps = {
  to: string
}

export default function Redirect({ to }: RedirectProps) {
  const navigate = useNavigate()

  useEffect(() => {
    if (to.startsWith('http')) {
      window.location.href = to
    } else {
      navigate(to)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
