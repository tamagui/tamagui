// @ts-ignore
import * as postmark from 'postmark'

const serverToken = process.env.POSTMARK_SERVER_TOKEN!

if (process.env.NODE_ENV === 'production') {
  if (!serverToken) {
    throw new Error(`No POSTMARK_SERVER_TOKEN env var is set`)
  }
}

export function sendProductPurchaseEmail(
  email: string,
  args: { name: string; product_name: string }
) {
  if (process.env.NODE_ENV !== 'production') {
    console.info(`Not sending email to ${email} since we're not on prod.`)
    return
  }

  const client = new postmark.ServerClient(serverToken)

  const htmlBody = wrapEmail(`
  <h1>Hey ${args.name}! 👋</h1>

  <p>Thank you for your purchase of ${args.product_name}!</p>

  <h2>Important: Accept Your GitHub Team Invite</h2>

  <p>To access the private repositories (Takeout, Takeout Static, Bento, and more), you need to <strong>accept the team invite</strong> that should be in your inbox from GitHub.</p>

  <p>If you don't see the invite email, you can re-send it by:</p>
  <ol>
    <li>Logging into your account at <a href="https://tamagui.dev">tamagui.dev</a></li>
    <li>Going to your Account settings</li>
    <li>Clicking the "Re-send GitHub Invite" button</li>
  </ol>

  ${whatYouGetSection}

  <p>If you have any questions or need help, just reply to this email or reach out at <a href="mailto:support@tamagui.dev">support@tamagui.dev</a>.</p>

  <p><strong>P.S.</strong> If you haven't already, be sure to join our Discord community!</p>

  ${emailFooter}
  `)

  return client.sendEmail({
    From: 'support@tamagui.dev',
    To: email,
    Subject: `Welcome to ${args.product_name}!`,
    HtmlBody: htmlBody,
  })
}

export function sendProductRenewalEmail(
  email: string,
  args: { name: string; product_name: string; amount_due?: number }
) {
  if (process.env.NODE_ENV !== 'production') {
    console.info(`Not sending email to ${email} since we're not on prod.`)
    return
  }

  const client = new postmark.ServerClient(serverToken)

  const amountText = args.amount_due
    ? `<strong>$${(args.amount_due / 100).toFixed(2)}</strong>`
    : 'the renewal amount'

  const htmlBody = wrapEmail(`
  <h1>Hey ${args.name}!</h1>

  <p><strong>Your subscription to ${args.product_name} will renew in approximately 7 days for ${amountText}.</strong></p>

  <p>If you'd like to continue, no action is needed — your subscription will renew automatically.</p>

  <p>If you'd like to cancel before the renewal, you can do so from your account page:</p>

  <div class="cta-container">
    <a href="https://tamagui.dev/account" class="cta-button">Manage Subscription</a>
  </div>

  ${whatYouGetSection}

  <p>If you have any questions, just reply to this email or reach out at <a href="mailto:support@tamagui.dev">support@tamagui.dev</a>.</p>

  ${emailFooter}
  `)

  return client.sendEmail({
    From: 'support@tamagui.dev',
    To: email,
    Subject: `Your ${args.product_name} subscription renews in ~7 days`,
    HtmlBody: htmlBody,
  })
}

// shared email styles
const emailStyles = `
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
  h1 { color: #000; }
  h2 { color: #333; margin-top: 30px; }
  .cta-button { background-color: #000; color: #fff !important; padding: 14px 28px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 10px 5px; font-weight: 600; }
  .cta-button-secondary { background-color: #666; }
  .coupon-box { background: #ffeb3b; color: #000; padding: 20px; border-radius: 12px; text-align: center; margin: 24px 0; }
  .coupon-code { font-size: 28px; font-weight: bold; letter-spacing: 2px; margin: 4px 0; font-family: monospace; }
  .coupon-discount { font-size: 18px; margin: 0; }
  ul { padding-left: 20px; }
  li { margin: 8px 0; }
  .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 14px; }
  .cta-container { text-align: center; margin: 30px 0; }
`

// shared "what you get" content - keep this updated!
const whatYouGetSection = `
  <h2>... we've been reborn</h2>

  <p>We've been incredibly busy rethinking what a modern stack means, and rebuilding it to a much higher degree of quality:</p>

  <ul>
    <li><strong>Tamagui 2</strong> - Better in every way: new components, re-written docs, easier install and setup, thousands of new tests. <strong><a href="https://tamagui.dev/blog/version-two">Read the announcement &rarr;</a></strong></li>
    <li><strong>One v1</strong> - One is now stable and works seamlessly with Metro, plus has more features than your favorite web framework. <strong><a href="https://onestack.dev/blog/version-one-rc1">Read about One &rarr;</a></strong></li>
    <li><strong>Takeout 2</strong> - A huge amount of effort went into this new stack. Tamagui 2, One 1, and Zero. 95+ Lighthouse scores, fully shared code, tons of AI skills and documentation. <strong><a href="https://tamagui.dev/takeout">More info</a></strong> | <strong><a href="https://takeout.tamagui.dev">Demo</a></strong></li>
    <li><strong>Takeout Static</strong> - A new simplified web-only starter with MDX blog/docs and 100 Lighthouse.</li>
    <li><strong>Bento Components</strong> - Rewritten for v2 with new components and more polish, updated libraries. Includes access to the private <a href="https://github.com/tamagui/bento">Bento source repo</a>.</li>
    <li><strong>Unlimited Team Members</strong> - Share access with your whole team.</li>
    <li><strong>AI Theme Generator</strong> - Opus-powered /theme generation for custom designs.</li>
  </ul>
`

// shared intro - heartfelt message about the team's work
const emailIntro = `
  <p>I want to thank you so much for supporting our small team. We've been working very hard to not just rethink Tamagui, but One and Takeout and try to put together something genuinely beautiful and groundbreaking. If you take anything from this email, I hope you check out <a href="https://takeout.tamagui.dev">the new Takeout</a>. It's a product of love from our small team, and we could use support now more than ever to continue building dev tools that are simple, joyful, and surprisingly effective.</p>
`

// shared consulting callout
const emailConsulting = `
  <p style="text-align: center; color: #666; border-top: 1px solid #eee; border-bottom: 1px solid #eee; padding: 40px 0; margin: 24px 0;"><strong>We're now available to consult @ <a href="https://addeven.com">Add Even</a></strong></p>
`

// shared CTA buttons
const emailCTAs = `
  <div class="cta-container">
    <a href="https://tamagui.dev/account" class="cta-button">Upgrade</a>
    <a href="https://takeout.tamagui.dev" class="cta-button" style="background-color: #8b3a3a;">Takeout</a>
    <a href="https://tamagui.dev/blog/version-two" class="cta-button" style="background-color: #5c4033;">v2</a>
  </div>
`

// shared footer
const emailFooter = `
  <div class="footer">
    <p>Thanks for being part of Tamagui!<br><strong>- Nate & the Tamagui Team</strong></p>
  </div>
`

// email wrapper helper
function wrapEmail(body: string) {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>${emailStyles}</style>
</head>
<body>
${body}
</body>
</html>
  `.trim()
}

/**
 * Send email to V1 subscribers about Takeout 2 with 35% discount
 * Includes link to enable automatic V2 renewal
 */
export function sendV1UpgradeEmail(
  email: string,
  args: { name: string; subscriptionId: string; amount_due?: number }
) {
  if (process.env.NODE_ENV !== 'production') {
    console.info(`Not sending V1 upgrade email to ${email} since we're not on prod.`)
    return
  }

  const client = new postmark.ServerClient(serverToken)
  const couponCode = 'V1_UPGRADE_35'
  const enableV2Url = `https://tamagui.dev/pro/enable-v2-renewal?sub_id=${args.subscriptionId}`

  const amountText = args.amount_due
    ? `<strong>$${(args.amount_due / 100).toFixed(2)}</strong>`
    : 'the renewal amount'

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <style>${emailStyles}</style>
</head>
<body>
  <h1>Hey ${args.name}!</h1>

  <p><strong>Your Tamagui Pro subscription will renew in approximately 7 days for ${amountText}.</strong></p>

  <p>If you'd like to continue with your current plan, no action is needed. If you'd like to cancel, you can do so from your account page:</p>

  <div class="cta-container">
    <a href="https://tamagui.dev/account" class="cta-button">Manage Subscription</a>
  </div>

  <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />

  <h2>Consider upgrading to Takeout 2</h2>

  <p>We've been working hard on the next generation. <strong>Takeout 2</strong> features Tamagui 2, One 1, and Zero — a more realtime, responsive and Rails-like starter for React Native + Web.</p>

  <ul>
    <li><strong>Takeout 2</strong> - >95 Lighthouse, tons of scripts, helpers, hooks and UI in the box.</li>
    <li><strong>Takeout Static</strong> - Simplified web-only starter with 100 Lighthouse.</li>
    <li><strong>Unlimited Team Members</strong> - No more per-seat pricing.</li>
  </ul>

  <p>Enable automatic V2 renewal and get <strong>35% off</strong> applied automatically:</p>

  <div class="cta-container">
    <a href="${enableV2Url}" class="cta-button">Enable V2 Renewal (35% off)</a>
  </div>

  <p>Or purchase manually with coupon:</p>

  <div class="coupon-box">
    <div class="coupon-discount">35% off</div>
    <div class="coupon-code">${couponCode}</div>
  </div>

  <p>Check out the demo: <a href="https://takeout.tamagui.dev">takeout.tamagui.dev</a></p>

  <p>If you have any questions, just reply to this email or reach out at <a href="mailto:support@tamagui.dev">support@tamagui.dev</a>.</p>

  <div class="footer">
    <p>Thanks for being part of the Tamagui family!<br><strong>- Nate & the Tamagui Team</strong></p>
  </div>
</body>
</html>
  `.trim()

  return client.sendEmail({
    From: 'support@tamagui.dev',
    To: email,
    Subject: 'Your Tamagui Pro subscription renews in ~7 days',
    HtmlBody: htmlBody,
  })
}

/**
 * Confirmation email sent after V2 renewal is enabled
 */
export function sendV2RenewalEnabledEmail(email: string, args: { name: string }) {
  if (process.env.NODE_ENV !== 'production') {
    console.info(
      `Not sending V2 renewal enabled email to ${email} since we're not on prod.`
    )
    return
  }

  const client = new postmark.ServerClient(serverToken)

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <style>${emailStyles}</style>
</head>
<body>
  <h1>V2 Renewal Enabled! 🎉</h1>

  <p>Hey ${args.name},</p>

  <p>You've successfully enabled automatic V2 renewal for your Tamagui Pro subscription.</p>

  <h2>What happens next?</h2>

  <p>When your current V1 subscription renews, you'll automatically be upgraded to <strong>Takeout 2</strong> with <strong>35% off</strong> applied.</p>

  <p>You'll get access to:</p>
  <ul>
    <li><strong>Takeout 2</strong> - The complete React Native + Web starter with Tamagui 2, One 1, and Zero</li>
    <li><strong>Takeout Static</strong> - Web-only starter with 100 Lighthouse score</li>
    <li><strong>Bento Components</strong> - Full source repo access</li>
    <li><strong>Unlimited Team Members</strong> - No per-seat pricing</li>
    <li><strong>1 Year of Updates</strong> - Included with your purchase</li>
  </ul>

  <p>You can manage your subscription anytime from your <a href="https://tamagui.dev/account">account page</a>.</p>

  <p>If you have any questions, just reply to this email or reach out at <a href="mailto:support@tamagui.dev">support@tamagui.dev</a>.</p>

  <div class="footer">
    <p>Thanks for your continued support!<br><strong>- Nate & the Tamagui Team</strong></p>
  </div>
</body>
</html>
  `.trim()

  return client.sendEmail({
    From: 'support@tamagui.dev',
    To: email,
    Subject: 'V2 Renewal Enabled - Takeout 2 Upgrade Confirmed ✓',
    HtmlBody: htmlBody,
  })
}

/**
 * @deprecated Use sendV1UpgradeEmail instead
 */
export const sendV1ExpirationEmail = sendV1UpgradeEmail

/**
 * Send payment method reminder to users whose subscriptions are about to renew
 * but don't have a payment method attached
 */
export function sendPaymentMethodReminderEmail(
  email: string,
  args: { name: string; daysUntilExpiry: number; isApology?: boolean }
) {
  if (process.env.NODE_ENV !== 'production') {
    console.info(
      `Not sending payment reminder email to ${email} since we're not on prod.`
    )
    return
  }

  const client = new postmark.ServerClient(serverToken)

  const apologySection = args.isApology
    ? `
  <p style="background: #f5f5f5; padding: 16px; border-radius: 8px;">
    Our new Pro package has changed and so we've disabled auto-renew. For supporting our small team we'd like to thank you.
  </p>
  `
    : ''

  const urgencyText =
    args.daysUntilExpiry <= 0
      ? 'Your subscription has expired! But no sweat, we have some amazing new stuff for you to take a look at.'
      : args.daysUntilExpiry <= 3
        ? `Your subscription expires in ${args.daysUntilExpiry} day${args.daysUntilExpiry === 1 ? '' : 's'}!`
        : `Your subscription renews in ${args.daysUntilExpiry} days.`

  const htmlBody = wrapEmail(`
  ${emailIntro}

  <p><strong>${urgencyText}</strong></p>

  ${emailCTAs}

  ${apologySection}

  <div class="coupon-box">
    <div class="coupon-discount">30% off for returning</div>
    <div class="coupon-code">WELCOMEBACK30</div>
    <p style="margin: 4px 0 0; font-size: 14px;">Stacks with parity pricing!</p>
  </div>

  ${emailConsulting}

  ${whatYouGetSection}

  <p>Questions? Just reply to this email or reach out at <a href="mailto:support@tamagui.dev">support@tamagui.dev</a>.</p>

  ${emailFooter}
  `)

  return client.sendEmail({
    From: 'support@tamagui.dev',
    To: email,
    Subject: 'A genuine thank you',
    HtmlBody: htmlBody,
  })
}

/**
 * Send confirmation email when a user cancels their subscription
 */
export function sendCancellationEmail(
  email: string,
  args: { name: string; periodEnd: string }
) {
  if (process.env.NODE_ENV !== 'production') {
    console.info(`Not sending cancellation email to ${email} since we're not on prod.`)
    return
  }

  const client = new postmark.ServerClient(serverToken)

  const endDate = new Date(args.periodEnd).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const htmlBody = wrapEmail(`
  <h1>Your subscription has been cancelled</h1>

  <p>Hey ${args.name},</p>

  <p>Your Tamagui Pro subscription has been cancelled. You'll retain full access until <strong>${endDate}</strong>.</p>

  <p>If this was a mistake, you can re-subscribe anytime from your account page:</p>

  <div class="cta-container">
    <a href="https://tamagui.dev/account" class="cta-button">Go to Account</a>
  </div>

  <p>We'd love to have you back. If there's anything we could have done better, just reply to this email — we read every response.</p>

  ${emailFooter}
  `)

  return client.sendEmail({
    From: 'support@tamagui.dev',
    To: email,
    Subject: 'Your Tamagui Pro subscription has been cancelled',
    HtmlBody: htmlBody,
  })
}

/**
 * Send email when a payment fails
 */
export function sendPaymentFailedEmail(
  email: string,
  args: { name: string; amount?: number }
) {
  if (process.env.NODE_ENV !== 'production') {
    console.info(`Not sending payment failed email to ${email} since we're not on prod.`)
    return
  }

  const client = new postmark.ServerClient(serverToken)

  const amountText = args.amount ? ` of $${(args.amount / 100).toFixed(2)}` : ''

  const htmlBody = wrapEmail(`
  <h1>Payment failed</h1>

  <p>Hey ${args.name},</p>

  <p>We weren't able to process your payment${amountText} for your Tamagui Pro subscription. Stripe will retry the payment automatically, but if it continues to fail your subscription may be interrupted.</p>

  <p>Please update your payment method from your account page:</p>

  <div class="cta-container">
    <a href="https://tamagui.dev/account" class="cta-button">Update Payment Method</a>
  </div>

  <p>If you have any questions, just reply to this email or reach out at <a href="mailto:support@tamagui.dev">support@tamagui.dev</a>.</p>

  ${emailFooter}
  `)

  return client.sendEmail({
    From: 'support@tamagui.dev',
    To: email,
    Subject: 'Action needed: payment failed for your Tamagui Pro subscription',
    HtmlBody: htmlBody,
  })
}
