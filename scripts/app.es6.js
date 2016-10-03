// used to check if there is a new version of the app
window.addEventListener('load', function(e) {
    if(!window.applicationCache) return;

    window.applicationCache.addEventListener('updateready', function(e) {
        if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
            // we have a new version, we swap the old cache
            window.applicationCache.swapCache();
            // and reload the app
            window.location.reload();
        }
    }, false);

}, false);