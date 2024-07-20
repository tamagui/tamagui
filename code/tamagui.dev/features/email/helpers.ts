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

  return client.sendEmailWithTemplate({
    From: 'support@tamagui.dev',
    To: email,
    TemplateId: 32624033,
    TemplateModel: args,
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

  return client.sendEmailWithTemplate({
    From: 'support@tamagui.dev',
    To: email,
    TemplateId: 36673357,
    TemplateModel: args,
  })
}
