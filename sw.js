const CACHE = "mtv-cache-v2";
const ASSETS = [
  "/",
  "/index.html",
  "/style.css",
  "/app.js",
  "/channels.json",
  "/manifest.json",
  "/assets/icon.png",
  "/assets/splash-icon.png",
  "/assets/logos/fb.png",
  "/assets/logos/wa.png",
  "/assets/logos/fifa.png",
  "/assets/logos/t-sports.png",
  "/assets/logos/ptv.png",
  "/assets/logos/a-sports.png",
  "/assets/logos/sss-2.png",
  "/assets/logos/ss-2.png",
  "/assets/logos/ss-1.png",
  "/assets/logos/sos-2.png",
  "/assets/logos/sos-1.png",
  "https://vjs.zencdn.net/8.23.4/video-js.css",
  "https://vjs.zencdn.net/8.23.4/video.min.js"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  const { request } = e;
  if (request.method !== "GET") return;
  e.respondWith(
    caches.match(request).then((cached) => cached || fetch(request))
  );
});
