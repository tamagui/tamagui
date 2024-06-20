import { getBentoCode, supabaseAdmin } from '~/features/auth/supabaseAdmin'

const hasBentoAccess = async (githubId: string) => {
  const result = await supabaseAdmin.rpc(
    // @ts-expect-error
    'has_bento_access',
    {
      github_id_input: githubId,
    }
  )
  const got = result?.data as unknown as any[]
  return Boolean(got?.length)
}

export async function apiCliBentoRoute(req, res) {
  const resultHasBentoAccess = await hasBentoAccess(req.query.userGithubId)

  if (!resultHasBentoAccess) {
    throw new Error('No bento access from CLI')
  }

  const slugsArray = Array.isArray(req.query.slug)
    ? req.query.slug
    : typeof req.query.slug === 'string'
      ? [req.query.slug]
      : []

  const codePath = slugsArray.join('/')

  const fileResult = await getBentoCode(codePath)
  res.setHeader('Content-Type', 'text/plain')
  res.send(fileResult)
}
