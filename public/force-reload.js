// Force reload script - AGGRESSIVE NO-CACHE VERSION
(function() {
  'use strict';
  
  console.log('GSL Game Zone: Force reload script loaded');
  
  // Clear ALL caches immediately
  if ('caches' in window) {
    caches.keys().then(function(cacheNames) {
      console.log('Clearing all caches:', cacheNames);
      return Promise.all(
        cacheNames.map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      console.log('All caches cleared');
    });
  }
  
  // Clear browser cache by reloading with cache-busting
  const addCacheBuster = function() {
    const url = new URL(window.location.href);
    url.searchParams.set('_t', Date.now().toString());
    if (url.searchParams.get('_t') !== window.location.search) {
      window.location.href = url.toString();
    }
  };
  
  // Check for updates every 10 minutes (less aggressive)
  setInterval(function() {
    console.log('Checking for updates...');
    
    // Only check for updates, don't force reload
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
        
        // Only reload if there's actually a change
        if (storedCheck && storedCheck !== currentCheck) {
          console.log('Site updated, reloading...');
          addCacheBuster();
        } else if (!storedCheck) {
          // First time, just store the check
          localStorage.setItem('gsl-gamezone-last-check', currentCheck);
        }
      }
    })
    .catch(error => {
      console.log('Update check failed:', error);
      // Don't force reload on network errors
    });
  }, 10 * 60 * 1000); // 10 minutes (much less frequent)
  
  // Only check on page focus if it's been a while (30+ minutes)
  let lastFocusTime = Date.now();
  window.addEventListener('focus', function() {
    const timeSinceLastFocus = Date.now() - lastFocusTime;
    console.log('Page focused, time since last focus:', timeSinceLastFocus);
    
    // Only check for updates if it's been more than 30 minutes
    if (timeSinceLastFocus > 30 * 60 * 1000) {
      console.log('Long time since last focus, checking for updates...');
      // Just check, don't force reload
      fetch(window.location.href, { 
        method: 'HEAD',
        cache: 'no-cache'
      }).then(response => {
        const lastModified = response.headers.get('last-modified');
        const etag = response.headers.get('etag');
        
        if (lastModified || etag) {
          const currentCheck = lastModified || etag;
          const storedCheck = localStorage.getItem('gsl-gamezone-last-check');
          
          if (storedCheck && storedCheck !== currentCheck) {
            console.log('Update found on focus, reloading...');
            addCacheBuster();
          }
        }
      }).catch(() => {
        // Don't reload on error
      });
    }
    
    lastFocusTime = Date.now();
  });
  
  // Remove aggressive visibility change listener
  
})();
