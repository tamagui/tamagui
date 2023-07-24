import * as postmark from 'postmark'

const serverToken = process.env.POSTMARK_SERVER_TOKEN

if (!serverToken) {
  throw new Error(`No POSTMARK_SERVER_TOKEN env var is set.`)
}

const client = new postmark.ServerClient(serverToken)

export function sendTakeoutWelcomeEmail(email: string) {
  client.sendEmail({
    From: 'noreply@tamagui.dev',
    To: email,
    Subject: 'Tamagui Takeout 🥡',
    TextBody: 'Takeout stuff - Hey this is me sending a test email...',
  })
}
