#!/usr/bin/env tsx

/**
 * Check recent Stripe webhook events
 *
 * Usage:
 *   tsx scripts/takeout/check-webhook-events.ts [--limit 100]
 */

import Stripe from 'stripe'

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY

if (!STRIPE_SECRET_KEY) {
  console.error('Missing STRIPE_SECRET_KEY environment variable')
  process.exit(1)
}

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
})

async function main() {
  const args = process.argv.slice(2)
  const limitIndex = args.indexOf('--limit')
  const limit = limitIndex !== -1 ? parseInt(args[limitIndex + 1], 10) : 100

  console.log(`\n${'='.repeat(80)}`)
  console.log(`RECENT STRIPE WEBHOOK EVENTS (Last ${limit})`)
  console.log('='.repeat(80) + '\n')

  const events = await stripe.events.list({ limit })

  console.log(`Found ${events.data.length} recent events\n`)

  // Group by event type
  const eventsByType = new Map<string, number>()
  const recentSubEvents: Stripe.Event[] = []

  events.data.forEach((event) => {
    eventsByType.set(event.type, (eventsByType.get(event.type) || 0) + 1)

    if (event.type.startsWith('customer.subscription')) {
      recentSubEvents.push(event)
    }
  })

  console.log('Event breakdown:')
  console.log('-'.repeat(80))
  Array.from(eventsByType.entries())
    .sort((a, b) => b[1] - a[1])
    .forEach(([type, count]) => {
      console.log(`  ${type}: ${count}`)
    })

  console.log('\n' + '='.repeat(80))
  console.log('RECENT SUBSCRIPTION EVENTS')
  console.log('='.repeat(80) + '\n')

  if (recentSubEvents.length === 0) {
    console.log('No recent subscription events found')
  } else {
    recentSubEvents.slice(0, 20).forEach((event) => {
      const sub = event.data.object as Stripe.Subscription
      const date = new Date(event.created * 1000).toISOString()
      console.log(`[${date}] ${event.type}`)
      console.log(`  Subscription: ${sub.id}`)
      console.log(`  Status: ${sub.status}`)
      if (event.type === 'customer.subscription.deleted') {
        console.log(`  🗑️  This subscription was cancelled`)
      }
      console.log('')
    })

    if (recentSubEvents.length > 20) {
      console.log(`... and ${recentSubEvents.length - 20} more subscription events`)
    }
  }

  // Check for failed webhook deliveries
  console.log('\n' + '='.repeat(80))
  console.log('WEBHOOK ENDPOINT STATUS')
  console.log('='.repeat(80) + '\n')

  const endpoints = await stripe.webhookEndpoints.list()

  if (endpoints.data.length === 0) {
    console.log('⚠️  No webhook endpoints configured!')
  } else {
    endpoints.data.forEach((endpoint) => {
      console.log(`Endpoint: ${endpoint.url}`)
      console.log(`  Status: ${endpoint.status}`)
      console.log(`  Events: ${endpoint.enabled_events.join(', ')}`)
      console.log('')
    })
  }
}

main().catch(console.error)
