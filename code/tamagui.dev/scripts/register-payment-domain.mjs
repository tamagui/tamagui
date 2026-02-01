#!/usr/bin/env node

/**
 * Register tamagui.dev as a payment method domain for Stripe Link
 * Run: node scripts/register-payment-domain.mjs
 *
 * Prerequisites:
 * - STRIPE_SECRET_KEY env var must be set
 *
 * This is required for Stripe Link to work properly. Without domain registration,
 * you may see "Unable to download payment manifest" errors in Chrome.
 *
 * See: https://docs.stripe.com/payments/payment-methods/pmd-registration
 */

import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
})

const DOMAINS_TO_REGISTER = ['tamagui.dev', 'www.tamagui.dev']

async function listExistingDomains() {
  try {
    const domains = await stripe.paymentMethodDomains.list({ limit: 100 })
    console.log('Existing payment method domains:')
    for (const domain of domains.data) {
      console.log(
        `  - ${domain.domain_name} (${domain.enabled ? 'enabled' : 'disabled'})`
      )
    }
    return domains.data
  } catch (error) {
    console.error('Error listing domains:', error.message)
    return []
  }
}

async function registerDomain(domainName) {
  try {
    console.log(`\nRegistering domain: ${domainName}...`)

    const domain = await stripe.paymentMethodDomains.create({
      domain_name: domainName,
    })

    console.log(`  Created: ${domain.id}`)
    console.log(`  Status: ${domain.enabled ? 'enabled' : 'pending validation'}`)

    // Validate the domain
    if (!domain.enabled) {
      console.log(`  Validating...`)
      const validated = await stripe.paymentMethodDomains.validate(domain.id)
      console.log(`  Validation result: ${validated.enabled ? 'success' : 'pending'}`)
    }

    return domain
  } catch (error) {
    if (error.code === 'resource_already_exists') {
      console.log(`  Domain already registered`)
      return null
    }
    console.error(`  Error: ${error.message}`)
    throw error
  }
}

async function main() {
  console.log('=== Stripe Payment Method Domain Registration ===\n')

  // List existing domains
  const existing = await listExistingDomains()
  const existingNames = existing.map((d) => d.domain_name)

  // Register missing domains
  for (const domain of DOMAINS_TO_REGISTER) {
    if (existingNames.includes(domain)) {
      console.log(`\n${domain} is already registered`)
      continue
    }
    await registerDomain(domain)
  }

  console.log('\n=== Done ===')
  console.log('\nIf domains are pending validation, you may need to:')
  console.log('1. Add DNS TXT records as specified in Stripe Dashboard')
  console.log('2. Wait for DNS propagation')
  console.log('3. Re-run this script to validate')
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
