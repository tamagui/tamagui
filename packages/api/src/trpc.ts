import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@my/supabase/types'
import { TRPCError, initTRPC } from '@trpc/server'
import { type CreateNextContextOptions } from '@trpc/server/adapters/next'
import superJson from 'superjson'

export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  // if there's auth cookie it'll be authenticated by this helper
  const supabase = createPagesServerClient<Database>(opts)

  // native sends these instead of cookie auth
  if (opts.req.headers.authorization && opts.req.headers['refresh-token']) {
    const accessToken = opts.req.headers.authorization.split('Bearer ').pop()
    const refreshToken = opts.req.headers['refresh-token']
    if (accessToken && typeof refreshToken === 'string') {
      await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      })
    }
  }

  const {
    data: { session },
  } = await supabase.auth.getSession()

  return {
    requestOrigin: opts.req.headers.origin,

    /**
     * The Supabase user session
     */
    session,

    /**
     * The Supabase instance with the authenticated session on it (RLS works)
     *
     * You should import `supabaseAdmin` from packages/app/utils/supabase/admin  in case you want to
     * do anything on behalf of the service role (RLS doesn't work - you're admin)
     */
    supabase,
  }
}

// Avoid exporting the entire t-object since it's not very descriptive.
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superJson,
})

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const publicProcedure = t.procedure

/** Reusable middleware that enforces users are logged in before running the procedure. */
const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }

  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  })
})

/**
 * Protected (authenticated) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use this. It verifies
 * the session is valid and guarantees `ctx.session.user` is not null.
 *
 * @see https://trpc.io/docs/procedures
 */
export const protectedProcedure = t.procedure.use(enforceUserIsAuthed)
