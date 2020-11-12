importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

if (workbox) {
  console.log(`Workbox dipakai`);
} else {
  console.log(`Workbox tidak bisa dipakai`);
}

workbox.precaching.precacheAndRoute([
    { url: '/', revision: '1'},
    { url: '/index.html', revision: '1'},
    { url: '/manifest.json', revision: '1'},
    { url: '/sework.js', revision: '1'},
    { url: '/img/436px-Serie_A_Logo_(ab_2019).png', revision: '1'},
    { url: '/img/wp2011113-serie-a-wallpapers.jpg', revision: '1'},
    { url: '/img/wp2011114-serie-a-wallpapers.png', revision: '1'},
    { url: '/img/wp2011120-serie-a-wallpapers.jpg', revision: '1'},
    { url: '/img/icon192.png', revision: '1'},
    { url: '/img/icon512.png', revision: '1'},
    { url: '/css/materialize.min.css', revision: '1'},
    { url: '/css/style.css', revision: '1'},
    { url: '/halaman/footer.html', revision: '1'},
    { url: '/halaman/klasemen.html', revision: '1'},
    { url: '/halaman/tim.html', revision: '1'},
    { url: '/halaman/favorit.html', revision: '1'},
    { url: '/halaman/navigasi.html', revision: '1'},
    { url: '/halaman/home.html', revision: '1'},
    { url: '/js/materialize.min.js', revision: '1'},
    { url: '/js/jquery-2.1.1.min.js', revision: '1'},
    { url: '/js/navigasi.js', revision: '1'},
    { url: '/js/serviceworker.js', revision: '1'},
    { url: '/js/api.js', revision: '1'},
    { url: '/js/idb.js', revision: '1'},
]);

workbox.routing.registerRoute(
  /.*(?:png|gif|jpg|jpeg|svg)$/,
  workbox.strategies.cacheFirst({
    cacheName: 'cachegambar',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      }),
      new workbox.expiration.Plugin({
        maxEntries: 100,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      }),
    ]
  })
);

workbox.routing.registerRoute(
  new RegExp('https://api.football-data.org/v2/'),
  workbox.strategies.staleWhileRevalidate()
)

self.addEventListener('push', function(event) {
  var body;
  if (event.data) {
    body = event.data.text();
  } else {
    body = 'Push message no payload';
  }
  var options = {
    body: body,
    icon: 'img/icon512.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  event.waitUntil(
    self.registration.showNotification('Push Notification', options)
  );
});