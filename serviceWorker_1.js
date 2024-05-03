const CACHE_NAME = "asset_cache_v1";
const PRE_CACHE_URLS = [
    "/assets/sad.svg",
    "/assets/shock.svg",
    "/pwa_1/index.html",
    "/pwa_1/index.js",
    "/pwa_1/offline.html",
    "/pwa_1/pageNotFound.html",
];

const preCacheAssets = ()=>{
    return caches.open(CACHE_NAME).then(c=> c.addAll(PRE_CACHE_URLS))
}


//network first caching approach

// trying fetch from catch using then/catch pattern
const fetchFromAssetsCache = (e) =>{
    const url = new URL(e.request.url);

    if (url.pathname === '/assets/sad.svg' || url.pathname === '/assets/happy.svg') {
         return caches.match('/assets/shock.svg').then((cacheResp)=> cacheResp);
    }

    return fetch(e.request)
        .then((fetchResp) => {
            if(fetchResp.status === 404){
                return caches.match("/pwa_1/pageNotFound.html").then((c)=> c);
            } else{
                return fetchResp
            }
        })
        .catch((err)=>{
         return caches.match(e.request).then((cResponse)=>{
            return cResponse || caches.match("/pwa_1/offline.html").then((c)=> c)
        })
    })
}

self.addEventListener("install", (e)=>{
    console.log("service_worker_1 installing");
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
    console.log('service_worker_1 activated');

    return self.clients.claim();
});

self.addEventListener('fetch', (e)=> {
    console.log("====> fetch listener called")
    e.respondWith(fetchFromAssetsCache(e))
})























// trying fetch from catch using async/await pattern
// const fetchAssetsFromCache = async (e) => {
//     const url = new URL(e.request.url);
//     if (url.pathname === '/assets/sad.svg') {
//         return await caches.match('/assets/shock.svg')
//     } else {
//         try {
//             return await fetch(e.request);
//         } catch (error) {
//             return await caches.match(e.request) || caches.match("/pwa_1/offline.html");
//         }
//     }
// }


// trying caching by passing a promise directly to respondWith
// const fetchFromAssetsCache3 = (e) =>{
//     const url = new URL(e.request.url);
//
//     if (url.pathname === '/assets/sad.svg' || 'assets/happy.svg') {
//         return caches.match('/assets/shock.svg')
//     }
//
//     return fetch(e.request)
//         .then((fetchResp) => {
//             if(fetchResp.status === 404){
//                 return caches.match("/pwa_1/pageNotFound.html").then((c)=> c);
//             } else{
//                 return fetchResp
//             }
//         })
//         .catch((err)=>{
//             return caches.match(e.request) || caches.match("/pwa_1/offline.html")
//         })
// }
