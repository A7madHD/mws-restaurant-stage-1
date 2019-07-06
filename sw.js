var cacheName = "revRest-cahce-v";
var randomVerNum = Math.floor(Math.random()*10000);
cacheName += randomVerNum;

self.addEventListener('install', function(event){
  event.waitUntil(
    caches.open(cacheName).then(function(cahce){
      console.log(`The Cache ${cacheName} is open!`);
      return Cache.addAll([
        './index.html',
        './restaurant.html',
        './css/main.css',
        './css/responsive.css',
        './js/dbhelper.js',
        './js/main.js',
        './js/restaurant_info.js',
        './img/*',
        './data/*'
      ]);
    })
    .catch(function(error) {
      return 'Opps, there is this error: ' + error;
      })
  )
})

self.addEventListener('activate', function (event) {
  event.waitUntil(clients.claim())
})

self.addEventListener('fetch', function(event){
  event.respondWith(
    caches.match(event.request).then(function(response){
      if (response) return response; return fetch(event.request);
    })
  )
})