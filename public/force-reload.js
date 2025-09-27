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
  
  // Check for updates every 2 minutes (more frequent)
  setInterval(function() {
    console.log('Checking for updates...');
    
    // Force reload with cache busting
    fetch(window.location.href, { 
      method: 'HEAD',
      cache: 'no-cache',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'If-Modified-Since': 'Thu, 01 Jan 1970 00:00:00 GMT'
      }
    })
    .then(response => {
      console.log('Update check response:', response.status);
      // Always reload to ensure fresh content
      if (response.status === 200) {
        console.log('Forcing reload for fresh content...');
        addCacheBuster();
      }
    })
    .catch(error => {
      console.log('Update check failed, forcing reload:', error);
      addCacheBuster();
    });
  }, 2 * 60 * 1000); // 2 minutes
  
  // Also check on page focus (when user returns to tab)
  window.addEventListener('focus', function() {
    console.log('Page focused, checking for updates...');
    addCacheBuster();
  });
  
  // Check on visibility change
  document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
      console.log('Page visible, checking for updates...');
      addCacheBuster();
    }
  });
  
})();
