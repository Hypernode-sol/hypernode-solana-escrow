
FROM node:20-alpine

WORKDIR /usr/src/app

COPY ../sdk ./sdk
COPY server.js ./

RUN npm install @coral-xyz/anchor @solana/web3.js express

ENV NODE_ENV=production

CMD ["node", "server.js"]
