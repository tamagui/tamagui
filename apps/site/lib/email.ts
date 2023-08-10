import * as postmark from 'postmark'

const serverToken = process.env.POSTMARK_SERVER_TOKEN

if (!serverToken) {
  throw new Error(`No POSTMARK_SERVER_TOKEN env var is set.`)
}

const client = new postmark.ServerClient(serverToken)

export function sendTakeoutWelcomeEmail(email: string, { name }: { name: string }) {
  return client.sendEmailWithTemplate({
    From: 'support@tamagui.dev',
    To: email,
    TemplateId: 32624033,
    // TemplateAlias: 'takeout-welcome',
    TemplateModel: { name, product_name: 'Takeout' },
  })
}
