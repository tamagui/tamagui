import { Database } from '@my/supabase/types'
import {
  createPagesServerClient,
  createServerSupabaseClient,
} from '@supabase/auth-helpers-nextjs'
import { AUTH_COOKIE_NAME } from 'app/utils/auth'
import { GetServerSideProps, PreviewData } from 'next'
import { ParsedUrlQuery } from 'querystring'

/**
 * getServerSideProps for auth pages - will redirect authenticated users - pass your own function as the only arg
 */
export function userProtectedGetSSP<
  Props extends { [key: string]: any } = { [key: string]: any },
  Params extends ParsedUrlQuery = ParsedUrlQuery,
  Preview extends PreviewData = PreviewData
>(
  getServerSideProps?: GetServerSideProps<Props, Params, Preview>
): GetServerSideProps<Props, Params, Preview> {
  return async (ctx) => {
    const supabase = createPagesServerClient<Database>(ctx)

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return {
        redirect: {
          destination: '/sign-in',
          permanent: false,
        },
      }
    }

    const getSSRResult = getServerSideProps
      ? await getServerSideProps(ctx)
      : { props: {} as Props }
    if ('props' in getSSRResult) {
      // add the initialSession to page's getServerSideProps
      ;(getSSRResult.props as any).initialSession = session
    }
    return getSSRResult
  }
}
