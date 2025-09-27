// Force reload script to ensure users get the latest version
(function() {
  'use strict';
  
  // Version tracking
  const CURRENT_VERSION = Date.now().toString();
  const VERSION_KEY = 'gsl-gamezone-version';
  
  // Check if this is a new version
  const storedVersion = localStorage.getItem(VERSION_KEY);
  
  if (storedVersion && storedVersion !== CURRENT_VERSION) {
    console.log('New version detected, clearing cache and reloading...');
    
    // Clear all caches
    if ('caches' in window) {
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.map(function(cacheName) {
            return caches.delete(cacheName);
          })
        );
      });
    }
    
    // Clear localStorage (except for important data)
    const keysToKeep = ['theme', 'language', 'stats'];
    const importantData = {};
    keysToKeep.forEach(key => {
      const value = localStorage.getItem(key);
      if (value) importantData[key] = value;
    });
    
    localStorage.clear();
    
    // Restore important data
    Object.keys(importantData).forEach(key => {
      localStorage.setItem(key, importantData[key]);
    });
    
    // Update version
    localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
    
    // Force reload
    window.location.reload(true);
  } else {
    // First visit or same version
    localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
  }
  
  // Periodic check for updates (every 5 minutes)
  setInterval(function() {
    // Check if there's a new version by making a HEAD request to the main page
    fetch(window.location.href, { 
      method: 'HEAD',
      cache: 'no-cache',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    })
    .then(response => {
      const lastModified = response.headers.get('last-modified');
      const etag = response.headers.get('etag');
      
      if (lastModified || etag) {
        const currentCheck = lastModified || etag;
        const storedCheck = localStorage.getItem('gsl-gamezone-last-check');
        
        if (storedCheck && storedCheck !== currentCheck) {
          console.log('Site updated, reloading...');
          window.location.reload(true);
        } else {
          localStorage.setItem('gsl-gamezone-last-check', currentCheck);
        }
      }
    })
    .catch(error => {
      console.log('Update check failed:', error);
    });
  }, 5 * 60 * 1000); // 5 minutes
  
})();
