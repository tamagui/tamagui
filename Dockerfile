FROM node:22

RUN corepack enable
RUN corepack prepare yarn@4.1.0 --activate

# unlock
RUN apt-get update && apt-get install -y git-crypt \
RUN echo "$GIT_CRYPT_KEY" | base64  -d > ./git-crypt-key \
  && git-crypt unlock ./git-crypt-key;
  rm ./git-crypt-key

WORKDIR /app

COPY . .

RUN yarn install
RUN yarn postinstall
RUN yarn build:js
RUN yarn x:build

EXPOSE 3000

CMD ["yarn", "x:serve"]
