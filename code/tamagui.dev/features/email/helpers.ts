import * as postmark from 'postmark'

const serverToken = process.env.POSTMARK_SERVER_TOKEN

if (!serverToken) {
  throw new Error(`No POSTMARK_SERVER_TOKEN env var is set`)
}

const client = new postmark.ServerClient(serverToken)

export function sendProductPurchaseEmail(
  email: string,
  args: { name: string; product_name: string }
) {
  if (process.env.NODE_ENV !== 'production') {
    console.info(`Not sending email to ${email} since we're not on prod.`)
    return
  }

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
    <li><strong>Takeout v1</strong>: <a href="https://github.com/tamagui/takeout">https://github.com/tamagui/takeout</a></li>
    <li><strong>Takeout v2 (Beta)</strong>: <a href="https://github.com/tamagui/takeout2">https://github.com/tamagui/takeout2</a></li>
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
        <p class="sub">Takeout v1: https://github.com/tamagui/takeout</p>
        <p class="sub">Takeout v2: https://github.com/tamagui/takeout2</p>
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

/**
 * Send email to V1 subscribers when their subscription is expiring
 * Informs them they need to purchase the new V2 plan to continue access
 */
export function sendV1ExpirationEmail(email: string, args: { name: string }) {
  if (process.env.NODE_ENV !== 'production') {
    console.info(`Not sending V1 expiration email to ${email} since we're not on prod.`)
    return
  }

  const htmlBody = `
<!DOCTYPE html>
<html>
<body>
  <h1>Hello ${args.name}!</h1>

  <p>Your Tamagui Pro subscription is expiring soon and will not be renewed.</p>

  <h2>Important: We've Updated Our Pro Plan</h2>

  <p>We've completely revamped Tamagui Pro for V2 with a new per-project licensing model that includes:</p>

  <ul>
    <li><strong>All Templates</strong> - V1 Takeout, V2 Takeout, and the new Takeout Static (100 Lighthouse score)</li>
    <li><strong>Unlimited Team Members</strong> - No more per-seat pricing</li>
    <li><strong>1 Year of Updates</strong> - Included with your purchase</li>
    <li><strong>Basic Chat Support</strong> - Included at no extra cost</li>
    <li><strong>Lifetime Code Rights</strong> - Keep the code forever</li>
  </ul>

  <h2>How to Continue Access</h2>

  <p>To maintain access to Tamagui Pro features, you'll need to purchase the new plan:</p>

  <p><a href="https://tamagui.dev/takeout" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Get Tamagui Pro V2 - $999</a></p>

  <p>The new plan is $999 per project (one web domain + iOS + Android), with optional $300/year upgrades to continue receiving updates after the first year.</p>

  <h2>What Happens When Your Subscription Expires?</h2>

  <ul>
    <li>You'll lose access to the private GitHub repositories</li>
    <li>Your existing code will continue to work (you own what you've downloaded)</li>
    <li>You won't receive new updates or features</li>
  </ul>

  <p>If you have any questions about the transition, please reach out to us at <a href="mailto:support@tamagui.dev">support@tamagui.dev</a>.</p>

  <p>Thank you for being a Tamagui Pro subscriber!<br>The Tamagui Team</p>

  <table class="body-sub">
    <tr>
      <td>
        <p class="sub">If you're having trouble with the button above, copy and paste this URL into your web browser:</p>
        <p class="sub">https://tamagui.dev/takeout</p>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()

  return client.sendEmail({
    From: 'support@tamagui.dev',
    To: email,
    Subject: 'Your Tamagui Pro subscription is expiring - Action required',
    HtmlBody: htmlBody,
  })
}
