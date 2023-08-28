import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import { AUTH_COOKIE_NAME } from 'app/utils/auth'
import { GetServerSideProps, PreviewData } from 'next'
import { ParsedUrlQuery } from 'querystring'

/**
 * user protected getServerSideProps - pass your own function as the only arg
 */
export function guestOnlyGetSSP<
  Props extends { [key: string]: any } = { [key: string]: any },
  Params extends ParsedUrlQuery = ParsedUrlQuery,
  Preview extends PreviewData = PreviewData
>(
  getServerSideProps?: GetServerSideProps<Props, Params, Preview>
): GetServerSideProps<Props, Params, Preview> {
  return async (ctx) => {
    const supabase = createPagesServerClient(ctx, { cookieOptions: { name: AUTH_COOKIE_NAME } })

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (session) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      }
    }

    if (getServerSideProps) {
      return getServerSideProps(ctx)
    }

    return {
      props: {} as Props,
    }
  }
}
