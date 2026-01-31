import { apiRoute } from '~/features/api/apiRoute'
import { supabaseAdmin } from '~/features/auth/supabaseAdmin'
import { STRIPE_PRODUCTS } from '~/features/stripe/products'

const TEST_USER_EMAIL = 'test-user@tamagui.dev'
const TEST_USER_PASSWORD = 'test-user-password-12345'

// admin secret for production access (set TEST_USER_ADMIN_SECRET env var)
const ADMIN_SECRET = process.env.TEST_USER_ADMIN_SECRET

type TestUserType = 'new' | 'v1' | 'v2'

/**
 * Test user endpoint for checkout flow testing
 *
 * GET /api/test-user?type=new|v1|v2
 *
 * In development: works without auth
 * In production: requires ?secret=<TEST_USER_ADMIN_SECRET>
 *
 * Creates/resets a test user with the specified subscription state:
 * - new: clean user with no subscriptions
 * - v1: user with V1 TamaguiPro subscription (should see upgrade card)
 * - v2: user with V2 TamaguiProV2 subscription (normal account state)
 *
 * Returns a magic link to log in as the test user
 */
export default apiRoute(async (req) => {
  const url = new URL(req.url)
  const type = url.searchParams.get('type') as TestUserType | null
  const secret = url.searchParams.get('secret')

  // security check
  const isDev = process.env.NODE_ENV === 'development'
  if (!isDev) {
    if (!ADMIN_SECRET) {
      return Response.json(
        { error: 'Test user endpoint not configured in production' },
        { status: 403 }
      )
    }
    if (secret !== ADMIN_SECRET) {
      return Response.json({ error: 'Invalid secret' }, { status: 403 })
    }
  }

  if (!type || !['new', 'v1', 'v2'].includes(type)) {
    return Response.json(
      { error: 'Invalid type. Use ?type=new|v1|v2' },
      { status: 400 }
    )
  }

  try {
    // step 1: get or create the test user in auth
    const userId = await getOrCreateTestUser()

    // step 2: ensure user exists in users table
    await ensureUserRecord(userId)

    // step 3: clean up existing subscriptions and related data
    await cleanupUserData(userId)

    // step 4: set up subscriptions based on type
    if (type === 'v1') {
      await createV1Subscription(userId)
    } else if (type === 'v2') {
      await createV2Subscription(userId)
    }
    // type === 'new' leaves the user with no subscriptions

    // step 5: generate magic link for login
    const { data: linkData, error: linkError } =
      await supabaseAdmin.auth.admin.generateLink({
        type: 'magiclink',
        email: TEST_USER_EMAIL,
        options: {
          redirectTo: `${url.origin}/account`,
        },
      })

    if (linkError || !linkData?.properties?.action_link) {
      throw new Error(`Failed to generate magic link: ${linkError?.message}`)
    }

    // the action_link from generateLink contains the token we need
    // but we want to redirect through our callback
    const actionLink = linkData.properties.action_link

    return Response.json({
      success: true,
      type,
      userId,
      email: TEST_USER_EMAIL,
      loginUrl: actionLink,
      message: `Test user set up as "${type}". Click loginUrl to log in.`,
    })
  } catch (error) {
    console.error('Error setting up test user:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return Response.json({ error: message }, { status: 500 })
  }
})

async function getOrCreateTestUser(): Promise<string> {
  // check if user exists
  const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
  const existingUser = existingUsers?.users?.find(
    (u) => u.email === TEST_USER_EMAIL
  )

  if (existingUser) {
    return existingUser.id
  }

  // create new user
  const { data: newUser, error } = await supabaseAdmin.auth.admin.createUser({
    email: TEST_USER_EMAIL,
    password: TEST_USER_PASSWORD,
    email_confirm: true,
    user_metadata: {
      full_name: 'Test User',
      // note: no github data - test user doesn't have github auth
    },
  })

  if (error || !newUser?.user) {
    throw new Error(`Failed to create test user: ${error?.message}`)
  }

  return newUser.user.id
}

async function ensureUserRecord(userId: string) {
  const { error } = await supabaseAdmin.from('users').upsert(
    {
      id: userId,
      email: TEST_USER_EMAIL,
      full_name: 'Test User',
    },
    { onConflict: 'id' }
  )

  if (error) {
    throw new Error(`Failed to ensure user record: ${error.message}`)
  }
}

async function cleanupUserData(userId: string) {
  // delete subscription_items first (foreign key constraint)
  const { data: subscriptions } = await supabaseAdmin
    .from('subscriptions')
    .select('id')
    .eq('user_id', userId)

  if (subscriptions?.length) {
    const subIds = subscriptions.map((s) => s.id)

    // delete subscription_items
    await supabaseAdmin
      .from('subscription_items')
      .delete()
      .in('subscription_id', subIds)

    // delete subscriptions
    await supabaseAdmin.from('subscriptions').delete().in('id', subIds)
  }

  // delete team memberships
  await supabaseAdmin.from('team_members').delete().eq('member_id', userId)

  // delete team subscriptions owned by user
  await supabaseAdmin.from('team_subscriptions').delete().eq('owner_id', userId)

  // delete product ownership
  await supabaseAdmin.from('product_ownership').delete().eq('user_id', userId)

  // delete claims
  // claims doesn't have user_id directly, it's linked via subscription
  // since we deleted subscriptions, orphaned claims would have null subscription_id

  // delete customers (stripe mapping) - we'll recreate if needed
  await supabaseAdmin.from('customers').delete().eq('id', userId)
}

async function createV1Subscription(userId: string) {
  const now = new Date()
  const oneYearFromNow = new Date(now)
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1)

  // create a mock subscription ID (prefixed to identify as test)
  const subscriptionId = `test_sub_v1_${userId.slice(0, 8)}`
  const subscriptionItemId = `test_si_v1_${userId.slice(0, 8)}`

  // insert subscription
  const { error: subError } = await supabaseAdmin.from('subscriptions').insert({
    id: subscriptionId,
    user_id: userId,
    status: 'active',
    metadata: { test: true, version: 'v1' },
    created: now.toISOString(),
    current_period_start: now.toISOString(),
    current_period_end: oneYearFromNow.toISOString(),
    cancel_at_period_end: false,
  })

  if (subError) {
    throw new Error(`Failed to create V1 subscription: ${subError.message}`)
  }

  // insert subscription item linking to V1 Pro price
  const { error: itemError } = await supabaseAdmin
    .from('subscription_items')
    .insert({
      id: subscriptionItemId,
      subscription_id: subscriptionId,
      price_id: STRIPE_PRODUCTS.PRO_SUBSCRIPTION.priceId,
    })

  if (itemError) {
    throw new Error(`Failed to create V1 subscription item: ${itemError.message}`)
  }
}

async function createV2Subscription(userId: string) {
  const now = new Date()
  const oneYearFromNow = new Date(now)
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1)

  // create subscription IDs
  const licenseSubId = `test_sub_v2_license_${userId.slice(0, 8)}`
  const licenseItemId = `test_si_v2_license_${userId.slice(0, 8)}`
  const upgradeSubId = `test_sub_v2_upgrade_${userId.slice(0, 8)}`
  const upgradeItemId = `test_si_v2_upgrade_${userId.slice(0, 8)}`

  // insert license subscription (the one-time purchase shows as active subscription)
  const { error: licenseSubError } = await supabaseAdmin
    .from('subscriptions')
    .insert({
      id: licenseSubId,
      user_id: userId,
      status: 'active',
      metadata: { test: true, version: 'v2', type: 'pro_v2_license' },
      created: now.toISOString(),
      current_period_start: now.toISOString(),
      current_period_end: oneYearFromNow.toISOString(),
      cancel_at_period_end: false,
    })

  if (licenseSubError) {
    throw new Error(
      `Failed to create V2 license subscription: ${licenseSubError.message}`
    )
  }

  // insert license subscription item
  const { error: licenseItemError } = await supabaseAdmin
    .from('subscription_items')
    .insert({
      id: licenseItemId,
      subscription_id: licenseSubId,
      price_id: STRIPE_PRODUCTS.PRO_V2_LICENSE.priceId,
    })

  if (licenseItemError) {
    throw new Error(
      `Failed to create V2 license subscription item: ${licenseItemError.message}`
    )
  }

  // insert upgrade subscription (trialing until 1 year from now)
  const { error: upgradeSubError } = await supabaseAdmin
    .from('subscriptions')
    .insert({
      id: upgradeSubId,
      user_id: userId,
      status: 'trialing',
      metadata: { test: true, version: 'v2', type: 'pro_v2_upgrade' },
      created: now.toISOString(),
      current_period_start: now.toISOString(),
      current_period_end: oneYearFromNow.toISOString(),
      trial_start: now.toISOString(),
      trial_end: oneYearFromNow.toISOString(),
      cancel_at_period_end: false,
    })

  if (upgradeSubError) {
    throw new Error(
      `Failed to create V2 upgrade subscription: ${upgradeSubError.message}`
    )
  }

  // insert upgrade subscription item
  const { error: upgradeItemError } = await supabaseAdmin
    .from('subscription_items')
    .insert({
      id: upgradeItemId,
      subscription_id: upgradeSubId,
      price_id: STRIPE_PRODUCTS.PRO_V2_UPGRADE.priceId,
    })

  if (upgradeItemError) {
    throw new Error(
      `Failed to create V2 upgrade subscription item: ${upgradeItemError.message}`
    )
  }
}
