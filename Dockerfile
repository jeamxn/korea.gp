# ---------- build stage ----------
FROM node:22-alpine AS builder

RUN corepack enable && corepack prepare pnpm@11.3.0 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# ---------- runtime stage ----------
FROM node:22-alpine AS runner

RUN corepack enable && corepack prepare pnpm@11.3.0 --activate
RUN pnpm add -g serve@14.2.4

WORKDIR /app
COPY --from=builder /app/dist ./dist

ENV PORT=3000
EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
