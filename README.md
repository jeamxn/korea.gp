# korea.gp

> An interactive tribute to Formula 1 in Korea.

Real F1 chassis, live(-ish) telemetry, the Yeongam circuit animated. A
fullscreen single-page experience in the spirit of `japan.gp` and `canada.gp`.

## Features

- **5 real F1 chassis** — Ferrari, Red Bull, Mercedes, McLaren, Aston Martin
  (GLB models served from jsdelivr CDN), with team-coloured rim lighting,
  brand accents, and driver lineups.
- **Real-time interactivity** — orbit-drag the car, click for a boost, mouse
  parallax on grid + wordmark + chassis tilt, custom multi-state cursor.
- **Keyboard control** — `← →` / `↑ ↓` / `1-5` cycle teams, `SPACE` pauses
  rotation, `R` triggers a boost, `M` toggles sound, `F` enters fullscreen.
  Floating key hint feedback pill.
- **Synthesised telemetry** — speed / RPM / gear / throttle / brake / DRS
  driven by mouse activity; mini Yeongam track map with live lap dot,
  hover-revealed turn markers (T1..T18), sector indicators; mouse-driven
  G-force meter; winner timeline 2010-2013.
- **WebAudio SFX** — no asset download; engine rev sweep on team change,
  boost ramp, UI ticks. Starts muted (autoplay policy).
- **Cinematic post-FX** — Bloom + mild ChromaticAberration + Vignette;
  reflective floor under the car.
- **Accessible & resilient** — honours `prefers-reduced-motion`; pauses
  rotation when tab is hidden; gracefully degrades on mobile (no custom
  cursor, side panels collapse).

## Stack

- Vite 8 + React 19 + TypeScript
- Tailwind CSS v4
- react-router-dom v7
- three.js + @react-three/fiber + @react-three/drei
- @react-three/postprocessing
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

The runtime image serves the built `dist/` from `nginx:alpine` on port 3000
with SPA fallback (`try_files ... /index.html`) and gzip.

## Project layout

```
src/
  pages/Landing.tsx        # the single fullscreen page
  components/
    CarScene.tsx           # R3F canvas, lights, post-FX, OrbitControls
    CustomCursor.tsx       # cursor dot + ring with hover states
    TelemetryHUD.tsx       # speed / RPM / gear / DRS readout
    TrackMap.tsx           # SVG Yeongam circuit + live lap dot
    WinnersTimeline.tsx    # 2010-2013 winners bars
    GForce.tsx             # 2-axis G meter
  hooks/
    useMouse.ts            # smoothed mouse pos + velocity
    useTelemetry.ts        # synthesised driving values
    useEnvironment.ts      # reduced-motion / tab visibility / mobile
  lib/sfx.ts               # Web Audio synth (rev / tick / boost)
  data/teams.ts            # team metadata + GLB URLs
```

## Credits

3D models from [Moncito/f1-showroom-](https://github.com/Moncito/f1-showroom-)
(MIT). Fonts: Inter, Bebas Neue, JetBrains Mono via Google Fonts.
