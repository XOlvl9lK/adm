FROM node:16.13.0
WORKDIR /administration-backend

COPY package.json .
COPY package-lock.json .

RUN apt update
RUN apt install -y libreoffice-calc

RUN npm ci

COPY . .

RUN npm run build

ENV NODE_ENV=production

EXPOSE 3001

CMD ["node", "dist/main"]
