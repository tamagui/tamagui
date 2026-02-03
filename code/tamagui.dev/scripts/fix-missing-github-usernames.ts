import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * Fix missing github_user_name in users_private table
 * This syncs from user_metadata.user_name (which Supabase populates during OAuth)
 * to the users_private.github_user_name field
 */
async function main() {
  console.log(
    'Finding users with github username in metadata but not in users_private...\n'
  )

  // Get all users from auth
  const { data: authData } = await supabaseAdmin.auth.admin.listUsers()
  const users = authData?.users || []

  let fixed = 0
  let skipped = 0
  let noMetadata = 0

  for (const user of users) {
    const githubUsername = user.user_metadata?.user_name

    if (!githubUsername) {
      noMetadata++
      continue
    }

    // Check if users_private row exists and has github_user_name
    const { data: privateData } = await supabaseAdmin
      .from('users_private')
      .select('github_user_name')
      .eq('id', user.id)
      .maybeSingle()

    if (privateData?.github_user_name) {
      skipped++
      continue
    }

    // Need to fix - upsert the users_private row
    console.log(`Fixing: ${user.email} -> @${githubUsername}`)

    const { error } = await supabaseAdmin.from('users_private').upsert({
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name,
      github_refresh_token: user.user_metadata?.github_refresh_token,
      github_user_name: githubUsername,
    })

    if (error) {
      console.error(`  Error: ${error.message}`)
    } else {
      console.log(`  Done!`)
      fixed++
    }
  }

  console.log(`\n=== Summary ===`)
  console.log(`Fixed: ${fixed}`)
  console.log(`Already OK: ${skipped}`)
  console.log(`No github metadata: ${noMetadata}`)
  console.log(`Total users: ${users.length}`)
}

main().catch(console.error)
