/* Game Night offline helper for tycoon: the page comes from the internet when it can (so updates arrive),
   and from the copy saved on this phone when it can't. Fonts and this game's own files are kept after first use. */
const CACHE = 'gn-tycoon-v1';
const HOME = new URL('./', self.registration.scope).href;
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.add(HOME)).catch(() => {}).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('gn-tycoon-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
function save(key, res) { if (res && (res.ok || res.type === 'opaque')) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(key, copy)).catch(() => {}); } return res; }
/* the game page: try the internet for up to 3.5 seconds, then use the saved copy */
function page(req) {
  return new Promise(resolve => {
    let done = false;
    const finish = r => { if (!done && r) { done = true; resolve(r); } };
    const saved = () => caches.match(HOME);
    const slow = setTimeout(() => saved().then(finish), 3500);
    fetch(req).then(res => { clearTimeout(slow); finish(res.ok ? save(HOME, res) : res); })
      .catch(() => { clearTimeout(slow); saved().then(r => finish(r || Response.error())); });
  });
}
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (req.mode === 'navigate') { if (url.href.split('#')[0].split('?')[0] === HOME) e.respondWith(page(req)); return; }
  const own = url.origin === location.origin && url.href.startsWith(self.registration.scope);
  const font = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
  if (!own && !font) return;
  e.respondWith(caches.match(req).then(hit => {
    const net = fetch(req).then(res => save(req, res)).catch(() => hit || Response.error());
    return hit || net;
  }));
});
