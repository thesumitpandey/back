FROM node:16

ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

COPY pakage*.json./
RUN npm install --production

COPY . .

EXPOSE 5000

CMD [ "node", "index.js" ]