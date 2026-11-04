/* サービスワーカー：アプリの本体をキャッシュし、オフラインでも開けるようにする。
   ファイルを変えたら VERSION を上げる（古いキャッシュを捨てるため）。 */
const VERSION = 'vis-sim-v1';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './css/tokens.css',
  './css/style.css',
  './js/01-data.js',
  './js/02-state.js',
  './js/03-views.js',
  './js/04-playback.js',
  './js/05-controls.js',
  './js/pwa.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(VERSION).then((c) => c.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// 基本は「キャッシュを先に返し、裏で最新を取りに行く」。
// 外部のライブラリ（Tailwind・フォント・Tone.js）も、初回の取得後はキャッシュする。
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  event.respondWith(
    caches.open(VERSION).then(async (cache) => {
      const cached = await cache.match(req, { ignoreSearch: true });
      const network = fetch(req).then((res) => {
        if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
        return res;
      }).catch(() => cached);
      return cached || network;
    })
  );
});
