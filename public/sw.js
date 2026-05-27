// Minimal service worker — caches the 3D GLB models so repeat visits feel instant.
// Strategy: cache-first for the known model CDNs; pass-through everything else.

const CACHE = 'korea-gp-models-v1'

const MODEL_HOSTS = ['cdn.jsdelivr.net']

self.addEventListener('install', (event) => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
    ),
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET') return
  const url = new URL(req.url)
  if (!MODEL_HOSTS.includes(url.host)) return
  if (!url.pathname.endsWith('.glb')) return

  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const hit = await cache.match(req)
      if (hit) return hit
      const res = await fetch(req)
      if (res.ok) cache.put(req, res.clone())
      return res
    }),
  )
})
