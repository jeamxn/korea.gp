# korea.gp

Formula 1 × Korea — fullscreen landing page in the spirit of `japan.gp` / `canada.gp`.

A cinematic, single-screen tribute to the 2010–2013 Korean Grand Prix at the
Korea International Circuit (Yeongam) and a quiet provocation about its return.

## Stack

- Vite + React 19 + TypeScript
- Tailwind CSS v4
- react-router-dom v7
- framer-motion
- lucide-react

## Develop

```bash
pnpm install
pnpm dev
```

Visit http://localhost:5173

## Build

```bash
pnpm build
pnpm preview
```

## Docker

```bash
docker build -t korea-gp .
docker run --rm -p 3000:3000 korea-gp
```

## Design notes

- Fullscreen (100vw × 100vh), no scroll
- Editorial 2026 trend: oversized type, mono micro-copy, marquee, dividers
- Palette: ink black + paper white + Korean flag red `#CD2E3A` accent
- Type: Bebas Neue (display) + Inter (text) + JetBrains Mono (data)
