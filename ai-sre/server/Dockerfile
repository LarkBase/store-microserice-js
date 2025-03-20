FROM node:18

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

# Generate Prisma client (Fixes Query Engine Issue)
RUN npx prisma generate

EXPOSE 4000

# Run migrations and seed the database before starting the app
CMD npx prisma migrate dev --name init && npm run dev
