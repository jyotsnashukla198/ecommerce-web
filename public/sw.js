const CACHE_NAME = "ecommerce-cache-v1";
const STATIC_ASSESTS = [
    '/login',
    '/register'
];

//install-cache static assests
self.addEventListener('install',(event)=>{
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache)=>{
            // console.log("service worker:caching files");
            // return cache.addAll(STATIC_ASSESTS);
            return Promise.allSettled(
                STATIC_ASSESTS.map((url) =>
                cache.add(url).catch((err) => console.log("Failed to cache:", url, err))
                )
            );
        })
    )
    self.skipWaiting();
});

// Activate delete old caches
 
self.addEventListener('activate',(event)=>{
    event.waitUntil(
        caches.keys().then((keys)=>
            Promise.all(keys
                .filter((key)=>key!== CACHE_NAME)
                .map((key)=>caches.delete(key)))
        )
    )
    self.clients.claim();
})

// fetch - serve from cache fallback to network

self.addEventListener("fetch",(event)=>{
    if(event.request.method!=="GET") return;
     if (event.request.url.includes("/api/")) return;
    if (event.request.url.includes("_next/")) return;
    if (event.request.url.includes("worker.js")) return;  // ← add this
    if (event.request.url.includes("sw.js")) return;      // ← add this
    event.respondWith(
        caches.match(event.request).then((cached)=>{
            if(cached){
                console.log("SW:Serving from cache:",event.request.url);
                return cached;
            }
            // Not in cache- fetch from network and cache it
            return fetch(event.request).then((response)=>{
                 if (!response || response.status !== 200 || response.type === "opaque") {
                    return response;
                 }
               const clone = response.clone();
               caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
              return response;
            })
        })
    )
})
