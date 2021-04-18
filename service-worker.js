// Initialize constants
const version = "spanish-quizzer-6";
const resources = [
    "./css/app.css",
    "./css/filtersPage.css",
    "./css/global.css",
    "./css/quizzer.css",
    "./css/reference.css",
    "./css/settingsPage.css",
    "./data/verbs.csv",
    "./data/vocab.csv",
    "./images/arrow-left.svg",
    "./images/favicon-32.png",
    "./images/favicon-180.png",
    "./images/favicon-192-maskable.png",
    "./images/favicon-192.png",
    "./images/favicon-512-maskable.png",
    "./images/favicon-512.png",
    "./images/plus.svg",
    "./images/settings.svg",
    "./images/sound.svg",
    "./images/trash.svg",
    "./images/x.svg",
    "./js/app.js",
    "./js/filters.js",
    "./js/filtersPage.js",
    "./js/global.js",
    "./js/quizzer.js",
    "./js/reference.js",
    "./js/settingsPage.js",
    "./vendor/diff.js",
    "./vendor/papaparse.js",
    "./vendor/vue-router.js",
    "./vendor/vue.js",
    "./index.html",
    "./",
];



self.addEventListener("install", function(event) {
    event.waitUntil(async function() {
        // Cache resources
        const cache = await caches.open(version);
        await cache.addAll(resources);
    }());
});



self.addEventListener("fetch", function(event) {
    // Ignore non-GET requests
    if (event.request.method !== "GET") return;

    event.respondWith(async function() {
        // Look for cached response
        const cache = await caches.open(version);
        const cachedResponse = await cache.match(event.request);

        if (cachedResponse) {
            // Update cache in the background
            event.waitUntil(cache.add(event.request));

            // Returned cached response
            return cachedResponse;
        }
        else {
            // Fall back to network
            const response = await fetch(event.request);

            // Add response to cache
            cache.put(event.request, response.clone());

            // Return response
            return response;
        }
    }());
});



self.addEventListener("activate", function(event) {
    event.waitUntil(
        // Remove outdated caches
        caches.keys().then(function (keys) {
            return Promise.all(
                keys.filter(function (key) {
                    return key != version;
                })
                .map(function (key) {
                    return caches.delete(key);
                })
            );
        })
    );
});
