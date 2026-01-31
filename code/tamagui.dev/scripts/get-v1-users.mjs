import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function getV1Users() {
  // Get all subscriptions with V1 products
  const { data: subscriptions, error } = await supabase
    .from('subscriptions')
    .select(`
      id,
      status,
      user_id,
      subscription_items (
        id,
        price:prices (
          id,
          product:products (
            id,
            name
          )
        )
      )
    `)
    .or('status.eq.active,status.eq.trialing,status.eq.past_due,status.eq.canceled')

  if (error) {
    console.error('Error:', error)
    return
  }

  // Filter for V1 products
  const v1Subs = subscriptions.filter((sub) =>
    sub.subscription_items?.some(
      (item) =>
        item.price?.product?.name === 'Tamagui Pro' ||
        item.price?.product?.name === 'Tamagui Pro Team Seats'
    )
  )

  // Get unique user IDs
  const userIds = [...new Set(v1Subs.map((s) => s.user_id))]

  // Get user details
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('id, email, full_name')
    .in('id', userIds)

  if (usersError) {
    console.error('Users error:', usersError)
    return
  }

  // Filter out test emails
  const realUsers = users.filter(
    (u) => u.email && !u.email.includes('takeout') && !u.email.includes('@tamagui.dev')
  )

  console.log('V1 Users to email:')
  console.log(JSON.stringify(realUsers, null, 2))
  console.log('Total real users:', realUsers.length)
  console.log('(Filtered out', users.length - realUsers.length, 'test accounts)')
}

getV1Users()
