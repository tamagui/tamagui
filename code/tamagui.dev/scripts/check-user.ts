import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const githubUsername = process.argv[2] || 'Funsaized'

async function check() {
  const { data: userPrivate } = await supabase
    .from('users_private')
    .select('*')
    .ilike('github_user_name', githubUsername)
    .single()

  if (!userPrivate) {
    console.log(`No user found with github username ${githubUsername}`)
    return
  }

  console.log('User ID:', userPrivate.id)
  console.log('GitHub:', userPrivate.github_user_name)

  const { data: subs } = await supabase
    .from('subscriptions')
    .select(`
      id,
      status,
      current_period_start,
      current_period_end,
      subscription_items (
        prices (
          product_id,
          products (id, name)
        )
      )
    `)
    .eq('user_id', userPrivate.id)

  console.log('\nSubscriptions:')
  for (const sub of subs || []) {
    const products = (sub.subscription_items as any)?.map((i: any) => i.prices?.products?.name).filter(Boolean)
    console.log('  - Status:', sub.status)
    console.log('    Products:', products?.join(', '))
    console.log('    Period:', sub.current_period_start, 'to', sub.current_period_end)
  }

  // Check GitHub team membership
  const GITHUB_ADMIN_TOKEN = process.env.GITHUB_ADMIN_TOKEN
  if (GITHUB_ADMIN_TOKEN) {
    const res = await fetch(
      `https://api.github.com/orgs/tamagui/teams/early-access/memberships/${userPrivate.github_user_name}`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_ADMIN_TOKEN}`,
          Accept: 'application/vnd.github+json',
        },
      }
    )
    if (res.status === 200) {
      const data = await res.json()
      console.log('\nGitHub Team Status:', data.state, '- role:', data.role)
    } else if (res.status === 404) {
      console.log('\nGitHub Team Status: NOT A MEMBER')
    } else {
      console.log('\nGitHub Team Status: Error checking -', res.status)
    }
  }
}

check()
