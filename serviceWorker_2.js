console.log("this is service_worker_2");

const CACHE_NAME = "sw_2_asset_cache_v1";
const PRE_CACHE_URLS = [
    "/assets/happy.svg",
    "/pwa_2/index.html",
    "/pwa_2/index.js",
    "/pwa_2/offline.html"
];

const preCacheAssets = ()=>{
    return caches.open(CACHE_NAME).then(c=> c.addAll(PRE_CACHE_URLS))
}


//network first caching approach

// trying fetch from catch using then/catch pattern
const fetchFromAssetsCache2 = (e) =>{

    return fetch(e.request)
        .then((fetchResp) => fetchResp)
        .catch((err)=>{
            return caches.match(e.request).then((cResponse)=>{
                return cResponse || caches.match("/pwa_2/offline.html").then((c)=> c)
            })
        })
}

self.addEventListener("install", (e)=>{
    console.log("service_worker_2 installing");
    self.skipWaiting();
    e.waitUntil(preCacheAssets())
})

self.addEventListener('activate', (e) => {
    // delete older caches.
    e.waitUntil(caches.keys()
        .then((keys)=>{
            Promise.all(keys
                .filter(key=>key !== CACHE_NAME)
                .map(keyToBeDeleted=> caches.delete(keyToBeDeleted)))
        }))

    console.log('Claiming control');
    console.log('service_worker_2 activated');

    return self.clients.claim();
});

self.addEventListener('fetch', (e)=> {
    e.respondWith(fetchFromAssetsCache2(e))
})
