// @ts-check

/**
 * Send Payment Method Reminder Emails
 *
 * Finds subscriptions that are:
 * 1. past_due - from migration without payment method
 * 2. trialing with trial ending soon and no payment method
 * 3. incomplete_expired or canceled in the last 90 days
 *
 * And sends them a reminder email to update their payment method.
 *
 * Usage:
 *   node scripts/send-payment-reminder-emails.mjs [--dry-run] [--yes] [--past-due-only] [--trialing-only] [--expired-only]
 *
 * Options:
 *   --dry-run         Show what would be sent without actually sending
 *   --yes             Skip confirmation prompt
 *   --past-due-only   Only send to past_due subscriptions
 *   --trialing-only   Only send to trialing subscriptions
 *   --expired-only    Only send to recently expired/canceled subscriptions
 */

import Stripe from 'stripe'
import * as postmark from 'postmark'
import * as dotenv from 'dotenv'
import * as readline from 'readline'

dotenv.config()

const STRIPE_KEY = process.env.STRIPE_SECRET_KEY
if (!STRIPE_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

const stripe = new Stripe(STRIPE_KEY, {
  apiVersion: '2020-08-27',
  appInfo: {
    name: 'Tamagui Payment Reminder',
    version: '0.1.0',
  },
})

const POSTMARK_TOKEN = process.env.POSTMARK_SERVER_TOKEN
if (!POSTMARK_TOKEN) {
  throw new Error('POSTMARK_SERVER_TOKEN is not set')
}

const postmarkClient = new postmark.ServerClient(POSTMARK_TOKEN)

const isDryRun = process.argv.includes('--dry-run')
const skipConfirmation = process.argv.includes('--yes')
const pastDueOnly = process.argv.includes('--past-due-only')
const trialingOnly = process.argv.includes('--trialing-only')
const expiredOnly = process.argv.includes('--expired-only')

// 90 days ago timestamp
const NINETY_DAYS_AGO = Math.floor((Date.now() - 90 * 24 * 60 * 60 * 1000) / 1000)

// rate limit: send 1 email per 200ms (5 per second) to be safe
const EMAIL_DELAY_MS = 200

const emailStyles = `
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
  h1 { color: #000; }
  h2 { color: #333; margin-top: 30px; }
  .cta-button { background-color: #000; color: #fff !important; padding: 14px 28px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 10px 5px; font-weight: 600; }
  .coupon-box { background: #ffeb3b; color: #000; padding: 20px; border-radius: 12px; text-align: center; margin: 24px 0; }
  .coupon-code { font-size: 28px; font-weight: bold; letter-spacing: 2px; margin: 4px 0; font-family: monospace; }
  .coupon-discount { font-size: 18px; margin: 0; }
  ul { padding-left: 20px; }
  li { margin: 8px 0; }
  .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 14px; }
  .cta-container { text-align: center; margin: 30px 0; }
`

const emailIntro = `
  <p>I want to thank you so much for supporting our small team. We've been working very hard to not just rethink Tamagui, but One and Takeout and try to put together something genuinely beautiful and groundbreaking. If you take anything from this email, I hope you check out <a href="https://takeout.tamagui.dev">the new Takeout</a>. It's a product of love from our small team, and we could use support now more than ever to continue building dev tools that are simple, joyful, and surprisingly effective.</p>
`

function buildEmailHtml(name, daysUntilExpiry, isApology) {
  const apologySection = isApology
    ? `
  <p style="background: #f5f5f5; padding: 16px; border-radius: 8px;">
    Our new Pro package has changed and so we've disabled auto-renew. For supporting our small team we'd like to thank you.
  </p>
  `
    : ''

  const urgencyText =
    daysUntilExpiry <= 0
      ? 'Your subscription has expired! But no sweat, we have some amazing new stuff for you to take a look at.'
      : daysUntilExpiry <= 3
        ? `Your subscription expires in ${daysUntilExpiry} day${daysUntilExpiry === 1 ? '' : 's'}!`
        : `Your subscription renews in ${daysUntilExpiry} days.`

  return `
<!DOCTYPE html>
<html>
<head>
  <style>${emailStyles}</style>
</head>
<body>
  ${emailIntro}

  <p><strong>${urgencyText}</strong></p>

  <div class="cta-container">
    <a href="https://tamagui.dev/account" class="cta-button">Upgrade</a>
    <a href="https://takeout.tamagui.dev" class="cta-button" style="background-color: #8b3a3a;">Takeout</a>
    <a href="https://tamagui.dev/blog/version-two" class="cta-button" style="background-color: #5c4033;">v2</a>
  </div>

  ${apologySection}

  <div class="coupon-box">
    <div class="coupon-discount">30% off for returning</div>
    <div class="coupon-code">WELCOMEBACK30</div>
    <p style="margin: 4px 0 0; font-size: 14px;">Stacks with parity pricing!</p>
  </div>

  <p style="text-align: center; color: #666; border-top: 1px solid #eee; border-bottom: 1px solid #eee; padding: 40px 0; margin: 24px 0;"><strong>We're now available to consult @ <a href="https://addeven.com">Add Even</a></strong></p>

  <h2>... we've been reborn</h2>

  <p>We've been incredibly busy rethinking what a modern stack means, and rebuilding it to a much higher degree of quality:</p>

  <ul>
    <li><strong>Tamagui 2</strong> - Better in every way: new components, re-written docs, easier install and setup, thousands of new tests. <strong><a href="https://tamagui.dev/blog/version-two">Read the announcement &rarr;</a></strong></li>
    <li><strong>One v1</strong> - One is now stable and works seamlessly with Metro, plus has more features than your favorite web framework. <strong><a href="https://onestack.dev/blog/version-one-rc1">Read about One &rarr;</a></strong></li>
    <li><strong>Takeout 2</strong> - A huge amount of effort went into this new stack. Tamagui 2, One 1, and Zero. 95+ Lighthouse scores, fully shared code, tons of AI skills and documentation. <strong><a href="https://tamagui.dev/takeout">More info</a></strong> | <strong><a href="https://takeout.tamagui.dev">Demo</a></strong></li>
    <li><strong>Takeout Static</strong> - A new simplified web-only starter with MDX blog/docs and 100 Lighthouse.</li>
    <li><strong>Bento Components</strong> - Rewritten for v2 with new components and more polish, updated libraries.</li>
    <li><strong>Unlimited Team Members</strong> - Share access with your whole team.</li>
    <li><strong>AI Theme Generator</strong> - Opus-powered /theme generation for custom designs.</li>
  </ul>

  <p>Questions? Just reply to this email or reach out at <a href="mailto:support@tamagui.dev">support@tamagui.dev</a>.</p>

  <div class="footer">
    <p>Thanks for being part of Tamagui!<br><strong>- Nate & the Tamagui Team</strong></p>
  </div>
</body>
</html>
  `.trim()
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function confirm(message) {
  if (skipConfirmation) return true

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise((resolve) => {
    rl.question(`${message} (y/N): `, (answer) => {
      rl.close()
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes')
    })
  })
}

async function sendEmail(email, name, daysUntilExpiry, isApology) {
  const subject = 'A genuine thank you'

  if (isDryRun) {
    return { success: true }
  }

  try {
    await postmarkClient.sendEmail({
      From: 'support@tamagui.dev',
      To: email,
      Subject: subject,
      HtmlBody: buildEmailHtml(name, daysUntilExpiry, isApology),
    })
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

async function getSubscriptions(status) {
  const subs = []
  let hasMore = true
  let startingAfter = undefined

  while (hasMore) {
    const response = await stripe.subscriptions.list({
      status,
      limit: 100,
      starting_after: startingAfter,
    })

    subs.push(...response.data)
    hasMore = response.has_more
    if (response.data.length > 0) {
      startingAfter = response.data[response.data.length - 1].id
    }
  }

  return subs
}

async function main() {
  console.info('\n=== Send Payment Method Reminder Emails ===\n')

  if (isDryRun) {
    console.info('🔍 DRY RUN MODE - No emails will be sent\n')
  }

  const toProcess = []
  const counts = {
    pastDue: 0,
    trialing: 0,
    expired: 0,
  }

  // past_due subscriptions (from migration, need apology)
  if (!trialingOnly && !expiredOnly) {
    console.info('Fetching past_due subscriptions...')
    const pastDueSubs = await getSubscriptions('past_due')
    const migratedPastDue = pastDueSubs.filter(
      (sub) => sub.metadata?.migrated_from && !sub.default_payment_method
    )
    counts.pastDue = migratedPastDue.length
    console.info(`  Found ${migratedPastDue.length} past_due migrated subscriptions`)

    for (const sub of migratedPastDue) {
      toProcess.push({
        subscription: sub,
        isApology: true,
        daysUntilExpiry: 0,
        type: 'past_due',
      })
    }
  }

  // trialing subscriptions about to expire without payment method
  if (!pastDueOnly && !expiredOnly) {
    console.info('Fetching trialing subscriptions...')
    const trialingSubs = await getSubscriptions('trialing')
    const needsReminder = trialingSubs.filter((sub) => {
      if (sub.default_payment_method) return false
      if (!sub.trial_end) return false

      const trialEndDate = new Date(sub.trial_end * 1000)
      const daysUntil = Math.ceil(
        (trialEndDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      )

      // remind if trial ends within 14 days
      return daysUntil <= 14
    })
    counts.trialing = needsReminder.length
    console.info(
      `  Found ${needsReminder.length} trialing subscriptions needing reminder`
    )

    for (const sub of needsReminder) {
      const trialEndDate = new Date(sub.trial_end * 1000)
      const daysUntilExpiry = Math.ceil(
        (trialEndDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      )

      toProcess.push({
        subscription: sub,
        isApology: !!sub.metadata?.migrated_from,
        daysUntilExpiry,
        type: 'trialing',
      })
    }
  }

  // expired subscriptions in last 90 days (incomplete_expired + canceled)
  if (!pastDueOnly && !trialingOnly) {
    console.info('Fetching recently expired subscriptions...')

    // incomplete_expired
    const incompleteExpired = await getSubscriptions('incomplete_expired')
    const recentIncomplete = incompleteExpired.filter(
      (sub) => sub.created >= NINETY_DAYS_AGO
    )

    // canceled recently
    const canceled = await getSubscriptions('canceled')
    const recentCanceled = canceled.filter((sub) => {
      // only include if canceled/ended in last 90 days
      const endedAt = sub.ended_at || sub.canceled_at
      return endedAt && endedAt >= NINETY_DAYS_AGO
    })

    const expired = [...recentIncomplete, ...recentCanceled]
    counts.expired = expired.length
    console.info(`  Found ${expired.length} recently expired subscriptions`)

    for (const sub of expired) {
      toProcess.push({
        subscription: sub,
        isApology: !!sub.metadata?.migrated_from,
        daysUntilExpiry: 0,
        type: 'expired',
      })
    }
  }

  console.info('')

  if (toProcess.length === 0) {
    console.info('No subscriptions need reminders!')
    return
  }

  // dedupe by customer email
  const seen = new Set()
  const dedupedToProcess = []

  for (const item of toProcess) {
    const customer =
      typeof item.subscription.customer === 'string'
        ? await stripe.customers.retrieve(item.subscription.customer)
        : item.subscription.customer

    if (customer.deleted || !customer.email) continue
    if (seen.has(customer.email)) continue

    seen.add(customer.email)
    dedupedToProcess.push({
      ...item,
      customer,
      email: customer.email,
      name: customer.name || customer.email.split('@')[0] || 'there',
    })
  }

  // show summary
  console.info('═'.repeat(60))
  console.info('                    SUMMARY')
  console.info('═'.repeat(60))
  console.info(`  Past due (with apology):     ${counts.pastDue}`)
  console.info(`  Trialing (expiring soon):    ${counts.trialing}`)
  console.info(`  Recently expired (90 days):  ${counts.expired}`)
  console.info('─'.repeat(60))
  console.info(`  Total subscriptions:         ${toProcess.length}`)
  console.info(`  Unique emails to send:       ${dedupedToProcess.length}`)
  console.info('═'.repeat(60))
  console.info('')

  if (isDryRun) {
    console.info('Recipients:')
    for (const item of dedupedToProcess) {
      console.info(`  - ${item.email} (${item.type}, apology: ${item.isApology})`)
    }
    console.info('')
    console.info('Run without --dry-run to send emails.')
    return
  }

  // confirm before sending
  const confirmed = await confirm(`\nSend ${dedupedToProcess.length} emails?`)
  if (!confirmed) {
    console.info('Aborted.')
    return
  }

  console.info(
    `\nSending ${dedupedToProcess.length} emails (with ${EMAIL_DELAY_MS}ms delay)...\n`
  )

  let sent = 0
  let failed = 0

  for (const item of dedupedToProcess) {
    process.stdout.write(`  &rarr; ${item.email}... `)

    const result = await sendEmail(
      item.email,
      item.name,
      item.daysUntilExpiry,
      item.isApology
    )

    if (result.success) {
      sent++
      console.info('✓')
    } else {
      failed++
      console.info(`✗ ${result.error}`)
    }

    // rate limit
    await sleep(EMAIL_DELAY_MS)
  }

  console.info('\n═'.repeat(60))
  console.info('                    RESULTS')
  console.info('═'.repeat(60))
  console.info(`  Sent:    ${sent}`)
  console.info(`  Failed:  ${failed}`)
  console.info('═'.repeat(60))
  console.info('\nDone!')
}

main().catch((error) => {
  console.error('Script failed:', error)
  process.exit(1)
})
