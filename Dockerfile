# use node base with bun installed - avoids vite+bun+docker hanging issues
# see: https://github.com/vitejs/vite/discussions/16030
FROM node:22

# install bun (pinned to avoid breaking changes from unpinned latest)
RUN npm install -g bun@1.2.22

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
# use a v3-specific argument so Railway's inherited v2 BENTO_BRANCH variable
# cannot override the validated Bento source for this build
ARG BENTO_V3_BETA_REF=50432b85cc47de443b640bee0bcf5decd119231e

# install dependencies (sharp needs libvips for image processing)
RUN apt-get update && apt-get install -y git bsdmainutils vim-common libvips-dev

WORKDIR /root/tamagui
COPY . .

# init git (allow empty commit if nothing to commit)
RUN git config --global user.email "you@example.com" && git config --global user.name "Docker Build" && git init . && git add -A && (git commit -m 'add' > /dev/null || true)

# clone the private bento repository as a sibling at the validated v3 commit
WORKDIR /root
RUN test -n "$BENTO_GITHUB_TOKEN" || { echo "BENTO_GITHUB_TOKEN is required" >&2; exit 1; }; \
    BENTO_GITHUB_AUTH="$(printf 'x-access-token:%s' "$BENTO_GITHUB_TOKEN" | base64 | tr -d '\n')" && \
    echo "Cloning bento repository (ref: $BENTO_V3_BETA_REF)..." && \
    git init --quiet bento && \
    git -C bento remote add origin https://github.com/tamagui/bento.git && \
    git -c http.https://github.com/.extraheader="Authorization: Basic $BENTO_GITHUB_AUTH" \
      -C bento fetch --quiet --depth 1 origin "$BENTO_V3_BETA_REF" && \
    git -C bento checkout --quiet --detach FETCH_HEAD && \
    echo "Bento repository cloned (ref: $BENTO_V3_BETA_REF)"

WORKDIR /root/tamagui

# first install without bento deps
RUN bun install

# merge bento dependencies into root package.json and reinstall
RUN node scripts/with-bento.mjs && bun install
RUN bun run build:js
RUN bun run build:app

EXPOSE 3000

CMD ["bash", "-c", "bun run docker:serve"]
