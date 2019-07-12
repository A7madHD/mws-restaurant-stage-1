var cacheName = "revRest-cahce-v";
var randomVerNum = Math.floor(Math.random()*10000);
cacheName += randomVerNum;

self.addEventListener('install', function(event){
  event.waitUntil(
    caches.open(cacheName).then(function(cache){
      console.log(`The Cache ${cache} is open!`);
      console.log(cache);
      return cache.addAll([
        '/*',
        '/index.html',
        '/restaurant.html',
        '/css/styles.css',
        '/js/dbhelper.js',
        '/js/main.js',
        '/js/restaurant_info.js',
        '/img/*',
        '/data/*'
      ]);
    })
    .catch(function(error) {
      return 'Opps, there is this error: ' + error;
      })
  )
})

self.addEventListener('activate', function (event) {
  event.waitUntil(
      caches.keys().then(function(keys){
          return Promise.all(keys.map(function(key, i){
              if(key !== CACHE_VERSION){
                  return caches.delete(keys[i]);
              }
          }))
      })
  )
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
      caches.match(event.request).then(function(res){
          if(res){
              return res;
          }
          requestBackend(event);
      })
  )
});

function requestBackend(event){
  var url = event.request.clone();
  return fetch(url).then(function(res){
      //if not a valid response send the error
      if(!res || res.status !== 200 || res.type !== 'basic'){
          return res;
      }

      var response = res.clone();

      caches.open(CACHE_VERSION).then(function(cache){
          cache.put(event.request, response);
      });

      return res;
  })
}
