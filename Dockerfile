FROM node:24.3

ARG CF_API_KEY
ARG CF_EMAIL
ARG CF_ZONE_ID
ARG DISCORD_BOT_TOKEN
ARG DISCORD_ID
ARG DISCORD_OAUTH2
ARG DISCORD_PUB_KEY
ARG GITHUB_ADMIN_TOKEN
ARG GITHUB_APP_CLIENT_ID
ARG GITHUB_APP_SECRET
ARG GITHUB_SPONSOR_WEBHOOK_SECRET
ARG GITHUB_TOKEN
ARG IS_TAMAGUI_DEV
ARG NEXT_PUBLIC_GITHUB_APP_ID
ARG NEXT_PUBLIC_GITHUB_AUTH_CLIENT_ID
ARG NEXT_PUBLIC_IS_TAMAGUI_DEV
ARG NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_URL
ARG POSTMARK_SERVER_TOKEN
ARG CLOUDFLARE_TURNSTILE_SECRET
ARG SHOULD_UNLOCK_GIT_CRYPT
ARG STRIPE_SECRET_KEY
ARG STRIPE_SIGNING_SIGNATURE_SECRET
ARG STUDIO_JWT_SECRET
ARG SUPABASE_SERVICE_ROLE_KEY
ARG TAKEOUT_RENEWAL_COUPON_ID
ARG URL
ARG ONE_SERVER_URL
ARG APP_NAME
ARG TAMAGUI_PRO_SECRET
ARG DEEPSEEK_API_KEY
ARG BENTO_GITHUB_TOKEN

# install dependencies (sharp needs libvips for image processing)
RUN apt-get update && apt-get install -y git bsdmainutils vim-common gh libvips-dev

WORKDIR /root/tamagui
COPY . .

# init git
RUN git config --global user.email "you@example.com" && git init . && git add -A && git commit -m 'add' > /dev/null

# Clone bento repository as sibling directory (optional)
WORKDIR /root
RUN if [ -n "$BENTO_GITHUB_TOKEN" ]; then \
      echo "Cloning bento repository..."; \
      unset GITHUB_TOKEN && \
      echo "$BENTO_GITHUB_TOKEN" | gh auth login --with-token && \
      gh repo clone tamagui/bento && \
      gh auth logout --hostname github.com && \
      echo "✅ Bento repository cloned" && \
      echo "REQUIRE_BENTO=true" > /tmp/bento_status; \
    else \
      echo "⚠️ BENTO_GITHUB_TOKEN not provided - bento features will not be available" && \
      echo "REQUIRE_BENTO=false" > /tmp/bento_status; \
    fi

WORKDIR /root/tamagui

# Set REQUIRE_BENTO based on whether bento was cloned
RUN export $(cat /tmp/bento_status)

RUN corepack enable
RUN corepack prepare yarn@4.5.0 --activate

# First install without bento deps
RUN yarn install --immutable

# Merge bento dependencies into root package.json and reinstall
RUN node scripts/with-bento.mjs
RUN yarn build:js
RUN yarn build:app

EXPOSE 3000

CMD ["yarn", "docker:serve"]
