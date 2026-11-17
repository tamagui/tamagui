---
id: t-mrf9aerh-1rhr0
title: Audit Postmark sales email delivery and related live signals
status: done
backend: git
sessions:
- ab-mrf9aevy-82349
created_at: 1783707328061
updated_at: 1783709748756
field_marks:
  active_form: 1783707328061
  body: 1783707328061
  claim: 1783707328061
  evidence_summary: 1783707328061
  parent: 1783707328061
  priority: 1783707328061
  recovery_ref: 1783707328061
  status: 1783707328061
  title: 1783707328061
---
# Postmark live audit — last 10 days (2026-06-30 .. 2026-07-10)

Read-only. Queried the live Postmark "Tamagui Site" server (DeliveryType: Live) via `POSTMARK_SERVER_TOKEN` from `code/tamagui.dev/.env`. No tokens or recipient addresses printed/stored; only aggregates below.

## Volume & deliverability (healthy)
- **Sent: 22** over the window (steady 2-4/day, no send on 2026-07-04/07-10).
- **Delivered cleanly: 21/22.** Message status = "Sent" for all 22.
- **Bounces in window: 1** — Type `Transient` / "Message delayed", `CanActivate: true`, not marked inactive (recoverable soft delay, not a hard failure). BounceRate 4.5% is inflated by tiny N.
- **SMTP API errors: 0. Spam complaints: 0.**
- Account-wide lifetime bounce breakdown: 4 total (2 hard, 2 delayed), 2 inactive addresses — deliverability reputation is fine.

## What was actually sent (subject family → code path)
| Subject | Count | Trigger |
|---|---|---|
| "Action needed: payment failed for your Tamagui Pro subscription" | 8 | `sendPaymentFailedEmail` ← Stripe `invoice.payment_failed` webhook (`app/api/stripe/webhook+api.ts:127`) |
| "Your Tamagui Pro subscription has been cancelled" | 7 | `sendCancellationEmail` ← `app/api/cancel-subscription+api.tsx:91` |
| "Your Tamagui Pro subscription renews in ~7 days" | 7 | `sendProductRenewalEmail` / renewal notice ← Stripe webhook (`app/api/stripe/webhook+api.ts:115`) |

All from `<support@tamagui.dev>`.

## Concrete findings worth flagging
1. **Stream skews to churn/dunning.** 15 of 22 (68%) are payment-failure + cancellation. 8 payment-failed webhooks and 7 cancellations in 10 days is a real retention signal, not just noise. Worth correlating with the Stripe/sales-pipeline audit (task t-mrf9aeqo, session ab-mrf9aesn).
2. **Zero new-purchase welcome emails.** `sendProductPurchaseEmail` ("Welcome to …", `features/auth/supabaseAdmin.ts:395`) fired **0** times in the window. Either no new sales landed, or the purchase→welcome path isn't firing. Should be cross-checked against Stripe new-subscription count for the same window — if Stripe shows new purchases but Postmark shows 0 welcome emails, that's a broken trigger.
3. **No open/link tracking at all.** Opens/Clicks/Tracked all 0; no `TrackOpens`/`TrackLinks` set on any `sendEmail` call in `features/email/helpers.ts`, and no `MessageStream` is specified (everything rides the default transactional stream). Consequence: renewal/upgrade *offer* emails (promotional in nature) go out with zero engagement telemetry and are mixed onto the transactional stream. If sales wants to measure effectiveness or protect transactional deliverability, enable open/link tracking on the offer emails and move them to a separate broadcast stream.

## No action taken
Read-only audit only — no email edited or sent, no code changed.
