FROM node:22

ARG GIT_CRYPT_KEY

# unlock
RUN apt-get update && apt-get install -y git git-crypt

RUN git init . && \
  echo "$GIT_CRYPT_KEY" | base64  -d > ./git-crypt-key && \
  git-crypt unlock ./git-crypt-key && \
  rm ./git-crypt-key && \
  rm -r .git

WORKDIR /app

COPY . .

RUN corepack enable
RUN corepack prepare yarn@4.1.0 --activate

RUN yarn install
RUN yarn build:js
RUN yarn x:build

EXPOSE 3000

CMD ["yarn", "x:serve"]
