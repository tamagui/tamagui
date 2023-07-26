import * as postmark from 'postmark'

const serverToken = process.env.POSTMARK_SERVER_TOKEN

if (!serverToken) {
  throw new Error(`No POSTMARK_SERVER_TOKEN env var is set.`)
}

const client = new postmark.ServerClient(serverToken)

export function sendTakeoutWelcomeEmail(email: string, { subId }: { subId: string }) {
  return client.sendEmail({
    From: 'support@tamagui.dev',
    To: email,
    Subject: 'Takeout Purchase 🥡',
    TextBody: `
Thank you for purchasing from Takeout!

You can get access to Takeout and private Discord channels from here: https://tamagui.dev/account/subscriptions
Your subscription ID: ${subId}

We hope you enjoy.

The Tamagui Team
`,
  })
}
