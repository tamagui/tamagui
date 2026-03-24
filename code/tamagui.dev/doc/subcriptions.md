# 📋 Tamagui Subscription Documentation

## Overview

This document provides a comprehensive guide to the Tamagui subscription system, covering all subscription plans, database architecture, payment flows, and implementation details.

## 1. 💳 Current Subscription Plans

### 🚀 PRO Plan

**Database Tables**: `subscriptions`, `subscription_items`, `products`, `prices`

- **🔄 Recurring Subscription** (Annual): $240/year
  - 🔐 Access to private Takeout GitHub repository
  - 🍱 Bento components download + private Bento source repo access
  - 💬 Private community Discord chat room (#takeout-general)
  - ♾️ Lifetime rights to all code and assets (even after subscription expires)
  - 👥 Supports team seats addition
- **💰 One-Time Payment**: $400 (one year access)
  - ✅ Same benefits as recurring except:
  - ❌ **No Discord takeout channel access** (limitation by design)
  - ❌ **Cannot add team seats** (team seats require recurring subscription)
  - 🏁 Auto renewal false
  - 📄 Creates invoice record instead of subscription

### 👥 Team Seats

**Database Tables**: `team_subscriptions`, `team_members`, `subscription_items`

- **💵 Price**: $100/seat/year (only available with PRO recurring)
- **🎁 Benefits per seat**:
  - ✨ Full PRO plan access for team member
  - 💬 Access to Discord #takeout-general channel
  - 🤝 Repository collaboration invite
- **⚠️ Limitations**:
  - 👑 Only team owner can manage Discord access
  - 🚫 Cannot be purchased with one-time PRO plan
  - 🔗 Linked to main PRO subscription via `subscription_items`

### 💬 Chat Support

**Database Tables**: `subscriptions`, `discord_invites`

- **💵 Price**: $200/month
- **🎁 Benefits**:
  - 🔒 Private Discord room for your team
  - 👥 2 Discord invites included
  - ⚡ Prioritized responses over community chat
  - 🔧 Can be combined with any other plan
- **⚙️ Implementation**: Creates separate monthly subscription

### 🎯 Support Tiers (1-3)

**Database Tables**: `subscriptions`, `subscription_items`

- **🥉 Tier 1**: $800/month
- **🥈 Tier 2**: $1,600/month
- **🥇 Tier 3**: $2,400/month
- **🎁 Benefits per tier**:
  - ⏰ 4 hours of development time per month
  - 🚀 Faster response times
  - 👥 4 additional private Discord chat invites
  - 🔧 Can be combined with Chat Support
- **⚙️ Implementation**: Creates separate monthly subscription

## 2. 🔧 Detailed Implementation Flow

### 🚀 PRO Plan Implementation

#### 🔄 Recurring Subscription Flow

```
User Purchase → create-subscription+api.ts → Stripe Subscription Creation
```

**🗄️ Database Flow**:

1. **🔌 API**: `create-subscription+api.ts`
2. **💳 Stripe**: Creates subscription with `PRO_SUBSCRIPTION_PRICE_ID`
3. **🪝 Webhook**: `webhook+api.ts` handles `customer.subscription.created`
4. **🗄️ Database**:
   - ➕ Insert into `subscriptions` table
   - ➕ Insert into `subscription_items` table
   - 🔗 Link via `subscription_items.subscription_id`

**🔑 Key Code Points**:

```typescript
// create-subscription+api.ts
const subscription = await stripe.subscriptions.create({
  customer: stripeCustomerId,
  items: [{ price: PRO_SUBSCRIPTION_PRICE_ID }],
  payment_behavior: 'default_incomplete',
  expand: ['latest_invoice.payment_intent'],
})
```

#### 💰 One-Time Payment Flow

```
User Purchase → create-subscription+api.ts → Stripe Invoice Creation
```

**🗄️ Database Flow**:

1. **🔌 API**: `create-subscription+api.ts` (when `disableAutoRenew: true`)
2. **💳 Stripe**: Creates invoice with `PRO_ONE_TIME_PRICE_ID`
3. **🪝 Webhook**: `webhook+api.ts` handles `invoice.paid`
4. **🗄️ Database**:
   - ➕ Insert into `subscriptions` with `cancel_at_period_end: true`
   - 📅 Set `cancel_at` to one year from creation
   - ➕ Insert into `subscription_items`

**🔑 Key Code Points**:

```typescript
// webhook+api.ts - manageOneTimePayment()
await supabaseAdmin.from('subscriptions').insert({
  id: invoice.id,
  user_id: uuid,
  status: 'active',
  cancel_at: oneYearFromNow.toISOString(),
  cancel_at_period_end: true,
})
```

### 👥 Team Seats Implementation

#### 🛒 Purchase Flow

```
User Purchase → create-subscription+api.ts → Update Existing PRO Subscription
```

**🗄️ Database Flow**:

1. **🔌 API**: `create-subscription+api.ts` (with `teamSeats > 0`)
2. **💳 Stripe**: Adds `TEAM_SEATS_SUBSCRIPTION_PRICE_ID` to existing subscription
3. **🪝 Webhook**: `webhook+api.ts` handles `customer.subscription.updated`
4. **🗄️ Database**:
   - 🔄 Update `subscription_items` table with team seats item
   - ➕ Create `team_subscriptions` record via `createTeamSubscription()`
   - 📊 Track seats in `team_subscriptions.total_seats`

**🔑 Key Code Points**:

```typescript
// create-subscription+api.ts
let items: Stripe.SubscriptionCreateParams.Item[] = [{ price: PRO_SUBSCRIPTION_PRICE_ID }]
if (teamSeatCount > 0) {
  items.push({ price: TEAM_SEATS_SUBSCRIPTION_PRICE_ID, quantity: teamSeatCount })
}
```

#### 👤 Team Member Management

**🗄️ Database Tables**: `team_members`, `team_subscriptions`, `users`

**➕ Add Member Flow**:

1. **🔌 API**: `team-seat+api.ts` POST endpoint
2. **🗄️ Database**: Insert into `team_members` table
3. **🐙 GitHub**: Invite to repository via `resend-github-invite+api.ts`
4. **💬 Discord**: Manual invitation through Discord panel

**➖ Remove Member Flow**:

1. **🔌 API**: `team-seat+api.ts` DELETE endpoint
2. **🗄️ Database**: Delete from `team_members` table
3. **🐙 GitHub**: Remove repository access
4. **💬 Discord**: Manual removal through Discord panel

#### 💬 Discord Seats Calculation

**📍 Logic Location**: `ensureSubscription.ts`, Discord API endpoints

```typescript
// Discord seats calculation logic
const baseSeats = subscription.quantity || 1 // PRO plan base seats
const teamSeats = teamSubscription?.total_seats || 0
const totalDiscordSeats = baseSeats + teamSeats
```

**🔄 Legacy Support**: For old takeout prices, seats are calculated from price description parsing.

### 💬 Chat Support & 🎯 Support Tiers Implementation

#### 🛒 Purchase Flow

```
User Purchase → upgrade-subscription+api.ts → Separate Monthly Subscription
```

**🗄️ Database Flow**:

1. **🔌 API**: `upgrade-subscription+api.ts`
2. **💳 Stripe**: Creates separate monthly subscription
3. **🪝 Webhook**: `webhook+api.ts` handles subscription events
4. **🗄️ Database**:
   - ➕ Insert separate record in `subscriptions` table
   - 📅 Different billing cycle from PRO plan

**🔑 Key Code Points**:

```typescript
// upgrade-subscription+api.ts
const items: Array<{ price: string; quantity?: number }> = []
if (chatSupport) {
  items.push({ price: STRIPE_PRODUCTS.CHAT.priceId })
}
if (supportTier > 0) {
  items.push({ price: STRIPE_PRODUCTS.SUPPORT.priceId, quantity: supportTier })
}
```

#### 💬 Discord Integration

**🗄️ Database Tables**: `subscriptions` (metadata), `discord_invites`

**🏗️ Channel Creation**:

- **🌐 General Channel**: For PRO users (#takeout-general)
- **🔒 Support Channel**: For Chat/Support tier users (private)

**📊 Metadata Storage**:

- Discord channel IDs stored in `subscriptions` table metadata:

```json
{
  "discord_channel": "1132001717215559691"
}
```

**👥 Member Management**:

- `discord_invites` table stores channel members and invitation status
- Tracks which users have been invited to which Discord channels
- Prevents duplicate invitations

**🔄 Reset Functionality**:

- **🔴 UI Reset Button**: Deletes entire Discord channel
- **🔌 API**: `discord/support+api.ts` and `discord/channel+api.ts` DELETE endpoints
- **⚠️ Effect**: All members lose access, channel must be recreated

## 3. 🕰️ Legacy Products & Migration

### 🏷️ Product Ownership System

**🗄️ Database Table**: `product_ownership`

**🎯 Purpose**:

- 📊 Track one-time purchases before subscription system
- 🍱 Provide Bento access for legacy users
- 🔧 Handle data migration issues

**💻 Usage**:

```typescript
// Check legacy 🍱 Bento access
const { data: ownership } = await supabase
  .from('product_ownership')
  .select('*')
  .eq('user_id', userId)
  .eq('product_id', BENTO_PRODUCT_ID)
```

### 🕰️ Legacy Discord Seats Calculation

**📍 Location**: `ensureSubscription.ts`

For old takeout subscriptions, Discord seats are calculated by parsing the price description:

```typescript
// Legacy price description parsing
const description = price.description || ''
const seatsMatch = description.match(/(\d+)\s*seats?/i)
const seats = seatsMatch ? parseInt(seatsMatch[1]) : 1
```

### 🔄 Migration Scripts

**🎯 Purpose**: Add users to `product_ownership` for data recovery

**💻 Usage**: When users lose access after system migration, manually add records to restore their benefits.

## 4. 🐙 Repository Access System

### 🐙 GitHub Integration

**🗄️ Database Table**: `claims`

**🔄 Flow**:

1. **👆 User Action**: Click "Takeout 1" or "Takeout 2" to open repos directly, or "Resend Invite" to send/resend GitHub team invite
2. **🔌 API**: `resend-github-invite+api.ts` handles invite requests
3. **🔍 GitHub Check**: `checkIfUserIsTeamMember()` in `github/helpers.ts`
4. **📤 Response Handling**:
   - **✅ Already Member**: Returns success message
   - **📧 New Invitation**: Sends GitHub team invite, shows success message

## 5. 🗄️ Database Schema Summary

### 🏗️ Core Tables

- **`subscriptions`**: Main subscription records
- **`subscription_items`**: Links subscriptions to products/prices
- **`products`**: Product definitions (PRO, Team Seats, Chat, Support)
- **`prices`**: Pricing information for each product
- **`customers`**: Stripe customer ID mapping

### 👥 Team Management

- **`team_subscriptions`**: Team subscription metadata
- **`team_members`**: Team member relationships
- **`team_invoices`**: Team-specific invoice tracking

### 🔐 Access Control

- **`claims`**: Repository and service access claims
- **`product_ownership`**: Legacy one-time purchase tracking
- **`users_private`**: GitHub tokens and private data

### 💬 Discord Integration

- **`subscriptions`**: Discord channel metadata (stores channel IDs in JSON)
- **`discord_invites`**: Discord member invitations and invitation status

## 6. ⚠️ Current Issues & TODOs

### 🐛 Known Issues

1. **🔀 Multiple Support Subscriptions Complexity**
   - Users can have both Chat and Support tier subscriptions
   - Creates billing complexity and multiple Discord channels
   - Seat calculation becomes complex across multiple subscriptions

2. **🔄 Discord Reset Limitations**
   - Reset button deletes entire channel
   - Hard to add new members after reset
   - No granular member removal

3. **💰 One-Time Payment Limitations**
   - No Discord access for one-time PRO purchases
   - Cannot add team seats to one-time purchases

4. **💳 Stripe Payment Confirmation Issue with Large Discounts**
   - **Problem**: When invoices are automatically paid due to large discounts (below Stripe's $0.50 minimum), Stripe doesn't create a payment intent, so there's no `clientSecret` to use for `stripe.confirmPayment()`
   - **Solution**: Check if the subscription/invoice is already paid and skip the payment confirmation step
   - **Implementation**: Use `data.amount_due && data.amount_due > 0 && data.clientSecret` condition before calling `stripe.confirmPayment()`
   - **Affected Scenarios**: Heavy discount codes (99.9% off) that bring total below $0.50 USD

### 🚀 Planned Improvements

1. **🔗 Consolidate Chat + Support Subscriptions**

   ```typescript
   // TODO: When user has Chat and purchases Support tier,
   // upgrade existing Chat subscription instead of creating new one
   // Benefits: Single Discord channel, unified billing, easier management
   ```

2. **✨ Enhanced Discord Management**
   - Individual member removal
   - Bulk member operations
   - Channel recreation without full reset

3. **📊 Improved Team Seat Management**
   - Better seat utilization tracking
   - Automated seat cleanup for inactive members

## 7. 🧪 Testing & Development

### 🎭 User Impersonation Tool

For testing user access and subscriptions, use the [Supabase SSR User Impersonate Tool](https://github.com/zetavg/supabase-ssr-user-impersonate-tool):

```bash
npm install
cp .env.example .env  # Fill in Supabase credentials
node main.mjs --email <user-email>
```

This tool allows developers to impersonate any user for testing subscription flows, Discord access, and repository claims.

### 🎯 Key Testing Scenarios

1. **🚀 PRO Subscription**: Test both recurring and one-time flows
2. **👥 Team Seats**: Test member addition/removal and Discord access
3. **🎯 Support Tiers**: Test private channel creation and seat calculation
4. **🐙 Repository Claims**: Test GitHub collaboration invites
5. **🔄 Legacy Migration**: Test product ownership access

## 8. 🔌 API Endpoints Summary

### 💳 Subscription Management

- **`/api/create-subscription`**: Create PRO + Team Seats subscriptions
- **`/api/upgrade-subscription`**: Add Chat/Support tier subscriptions
- **`/api/add-team-seats`**: Add additional team seats to existing subscription
- **`/api/cancel-subscription`**: Cancel subscription with period end

### 👥 Team Management

- **`/api/team-seat`**: GET (list), POST (invite), DELETE (remove) team members

### 💬 Discord Integration

- **`/api/discord/channel`**: Manage general Discord channel access
- **`/api/discord/support`**: Manage private support channel access
- **`/api/discord/search-member`**: Search Discord members for invitations

### 🪝 Webhooks

- **`/api/stripe/webhook`**: Handle all Stripe webhook events for subscription lifecycle

This documentation provides a complete overview of the Tamagui subscription system architecture and implementation details for team members to understand and maintain the codebase effectively.
