/* サービスワーカー：アプリの本体をキャッシュし、オフラインでも開けるようにする。
   ファイルを変えたら VERSION を上げる（古いキャッシュを捨てるため）。 */
const VERSION = 'vis-sim-v14';
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
  './js/06-sound.js',
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

// 通信を優先する（network-first）。更新したら、次の読み込みで必ず新しいファイルが届く。
// 通信できないとき（オフライン）だけ、保存しておいたファイルを使う。
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  event.respondWith(
    fetch(req).then((res) => {
      if (res && (res.ok || res.type === 'opaque')) {
        const copy = res.clone();
        caches.open(VERSION).then((cache) => cache.put(req, copy));
      }
      return res;
    }).catch(() => caches.open(VERSION).then((cache) => cache.match(req, { ignoreSearch: true })))
  );
});
