FROM node:22

RUN corepack enable
RUN corepack prepare yarn@4.1.0 --activate

RUN apt-get update && apt-get install -y git-crypt
RUN ./scripts/git-crypt-unlock.sh

WORKDIR /app

COPY . .

RUN yarn install
RUN yarn postinstall
RUN yarn build:js
RUN yarn x:build

EXPOSE 3000

CMD ["yarn", "x:serve"]
