/* ============================================================
   SERVICE WORKER — Crafting Tales by Vaishnavi
   KILL SWITCH: unregisters itself and clears all caches.
   Disabled during active development so code changes always
   load fresh from the server. Re-enable a caching strategy
   here (and the registration in index.html) before going live.
   ============================================================ */

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(k => caches.delete(k)));
    await self.registration.unregister();
    const clients = await self.clients.matchAll({ type: 'window' });
    clients.forEach(client => client.navigate(client.url));
  })());
});
