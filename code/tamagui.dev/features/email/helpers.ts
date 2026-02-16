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

  const htmlBody = `
<!DOCTYPE html>
<html>
<body>
  <h1>Hello ${args.name}!</h1>

  <p>Thank you for your purchase of ${args.product_name}!</p>

  <h2>Important: Accept Your GitHub Team Invite</h2>

  <p>To access the private repositories, you need to <strong>accept the team invite</strong> that should be in your inbox from GitHub.</p>

  <p>If you don't see the invite email, you can re-send it by:</p>
  <ol>
    <li>Logging into your account at <a href="https://tamagui.dev">tamagui.dev</a></li>
    <li>Going to your Account settings</li>
    <li>Clicking the "Re-send GitHub Invite" button</li>
  </ol>

  <h2>What You Get Access To</h2>

  <p>Once you accept the invite, you'll have access to:</p>
  <ul>
    <li><strong>Bento</strong> - Our premium component library: <a href="https://github.com/tamagui/bento">https://github.com/tamagui/bento</a></li>
    <li><strong>Takeout Pro</strong>: <a href="https://github.com/tamagui/takeout2">https://github.com/tamagui/takeout2</a></li>
    <li><strong>Takeout Pro Classic</strong>: <a href="https://github.com/tamagui/takeout">https://github.com/tamagui/takeout</a></li>
  </ul>

  <p>If you have any questions or need help, feel free to reach out to us at <a href="mailto:support@tamagui.dev">support@tamagui.dev</a>.</p>

  <p>We hope this finds you well,
    <br>The Tamagui Team</p>

  <p><strong>P.S.</strong> If you haven't already, be sure to join our Discord community!</p>

  <table class="body-sub">
    <tr>
      <td>
        <p class="sub">If you're having trouble with the links above, copy and paste these URLs into your web browser:</p>
        <p class="sub">Tamagui: https://tamagui.dev</p>
        <p class="sub">Bento: https://github.com/tamagui/bento</p>
        <p class="sub">Takeout Pro: https://github.com/tamagui/takeout2</p>
        <p class="sub">Takeout Pro Classic: https://github.com/tamagui/takeout</p>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()

  return client.sendEmail({
    From: 'support@tamagui.dev',
    To: email,
    Subject: `Welcome to ${args.product_name}!`,
    HtmlBody: htmlBody,
  })
}

export function sendProductRenewalEmail(
  email: string,
  args: { name: string; product_name: string }
) {
  if (process.env.NODE_ENV !== 'production') {
    console.info(`Not sending email to ${email} since we're not on prod.`)
    return
  }

  const client = new postmark.ServerClient(serverToken)

  const htmlBody = `
<!DOCTYPE html>
<html>
<body>
  <h1>Hello ${args.name}!</h1>

  <p>In a week your subscription to ${args.product_name} will renew.</p>

  <p>We really appreciate your support of our small business.</p>

  <p><strong>Use the code TAMAGUI_PRO_RENEWAL to get 25% off your renewal.</strong></p>

  <h2>We're happy to announce that the Takeout 2 Beta is now available!</h2>

  <p>It represents a huge upgrade in every way and a glimpse at the future of frontend development. Learn more about it in the private Takeout channel in discord.</p>

  <p>Feel free to reach out to us for help at <a href="mailto:support@tamagui.dev">support@tamagui.dev</a> if you have any questions.</p>

  <p>If you wish to cancel, you can do so by logging in, opening your account, and hitting cancel <a href="https://tamagui.dev">on the Tamagui site</a>.</p>

  <p>We hope this finds you well,
    <br>The Tamagui Team</p>

  <!-- Sub copy -->
  <table class="body-sub">
    <tr>
      <td>
        <p class="sub">If you're having trouble with the button above, copy and paste the URL below into your web browser and hit "Pro" after logging in.</p>
        <p class="sub">https://tamagui.dev</p>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()

  return client.sendEmail({
    From: 'support@tamagui.dev',
    To: email,
    Subject: `Your ${args.product_name} subscription will renew soon`,
    HtmlBody: htmlBody,
  })
}

const emailStyles = `
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
  h1 { color: #000; }
  h2 { color: #333; margin-top: 30px; }
  .cta-button { background-color: #000; color: #fff !important; padding: 14px 28px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 10px 5px; font-weight: 600; }
  .cta-button-secondary { background-color: #666; }
  .coupon-box { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #fff; padding: 20px; border-radius: 12px; text-align: center; margin: 24px 0; }
  .coupon-code { font-size: 28px; font-weight: bold; letter-spacing: 2px; margin: 10px 0; font-family: monospace; }
  .coupon-discount { font-size: 18px; opacity: 0.9; }
  ul { padding-left: 20px; }
  li { margin: 8px 0; }
  .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 14px; }
  .cta-container { text-align: center; margin: 30px 0; }
`

/**
 * Send email to V1 subscribers about Takeout 2 with 35% discount
 * Includes link to enable automatic V2 renewal
 */
export function sendV1UpgradeEmail(
  email: string,
  args: { name: string; subscriptionId: string }
) {
  if (process.env.NODE_ENV !== 'production') {
    console.info(`Not sending V1 upgrade email to ${email} since we're not on prod.`)
    return
  }

  const client = new postmark.ServerClient(serverToken)
  const couponCode = 'V1_UPGRADE_35'
  const enableV2Url = `https://tamagui.dev/pro/enable-v2-renewal?sub_id=${args.subscriptionId}`

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <style>${emailStyles}</style>
</head>
<body>
  <h1>Hey ${args.name}! 👋</h1>

  <p>Thank you for being a Tamagui Pro subscriber - we really appreciate your support!</p>

  <p>We're excited to announce <strong>Takeout 2</strong> is here, and it's the realization of years of effort to make a more realtime, responsive and Rails-like starter for React Native + Web.</p>

  <h2>What's New in Takeout 2</h2>

  <ul>
    <li><strong>Takeout 2</strong> - Featuring Tamagui 2, One 1, and Zero, it's a stack we poured effort into for years with way more refinement, great deployment / IaC options, and tons of scripts, helpers, hooks and UI in the box. Gets a >95 Lighthouse on a beautiful landing page that seamlessly transitions into a fully-loaded app experience.</li>
    <li><strong>Takeout Static</strong> - A nice simplified web-only starter with Vercel deploy, MDX blog and docs, and 100 Lighthouse.</li>
    <li><strong>Unlimited Team Members</strong> - No more per-seat pricing, instead per-project with friendly pricing.</li>
  </ul>

  <h2>New Pricing</h2>

  <p>The new plan is <strong>$350 per project</strong> (one web domain + iOS + Android), with an optional <strong>$100/year</strong> to continue receiving updates after the first year.</p>

  <h2>Automatic Upgrade Available</h2>

  <p>Want to upgrade to Takeout 2 when your current subscription renews? Enable automatic V2 renewal and you'll get <strong>35% off</strong> applied automatically - no coupon code needed!</p>

  <div class="cta-container">
    <a href="${enableV2Url}" class="cta-button">Enable V2 Renewal</a>
    <a href="https://tamagui.dev/account" class="cta-button cta-button-secondary">Learn More</a>
  </div>

  <p>Or if you'd prefer to purchase manually, use this coupon at checkout:</p>

  <div class="coupon-box">
    <div class="coupon-discount">35% off</div>
    <div class="coupon-code">${couponCode}</div>
  </div>

  <p>Check out the dedicated demo/landing for Takeout 2:</p>
  <ul>
    <li><a href="https://takeout.tamagui.dev">https://takeout.tamagui.dev</a></li>
  </ul>

  <p>If you have any questions or need help, just reply to this email or reach out at <a href="mailto:support@tamagui.dev">support@tamagui.dev</a>.</p>

  <div class="footer">
    <p>Thanks for being part of the Tamagui family!<br><strong>- Nate & the Tamagui Team</strong></p>
  </div>
</body>
</html>
  `.trim()

  return client.sendEmail({
    From: 'support@tamagui.dev',
    To: email,
    Subject: 'Introducing Takeout 2 + 35% Off for V1 Customers 🎉',
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
