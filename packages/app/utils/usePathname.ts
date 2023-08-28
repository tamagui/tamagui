import { useRouter } from 'next/router'

export const usePathname = () => {
  return useRouter().pathname
}
