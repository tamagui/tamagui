FROM node:22

RUN corepack enable
RUN corepack prepare yarn@4.1.0 --activate

RUN apt-get update && apt-get install -y git-crypt

WORKDIR /app

COPY . .

RUN yarn install
RUN yarn build:js

EXPOSE 3000

CMD ["yarn", "x:prod"]
