import { Database } from '@my/supabase/types'
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
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
    const supabase = createPagesServerClient<Database>(ctx)

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
