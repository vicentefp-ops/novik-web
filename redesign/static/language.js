(() => {
  'use strict';
  const preference = 'novik_web_language';
  const valid = value => value === 'es' || value === 'en';
  const remember = language => {
    try {
      localStorage.setItem(preference, language);
      return true;
    } catch {
      return false;
    }
  };

  // Only an explicit choice overrides the device's preferred browser language.
  document.addEventListener('click', event => {
    const link = event.target?.closest?.('.languages a');
    if (!link) return;
    const destination = new URL(link.href, location.origin);
    if (destination.origin !== location.origin) return;
    const language = /^\/es(?:\/|$)/.test(destination.pathname) ? 'es' : 'en';
    if (!remember(language) && language === 'en' && destination.pathname === '/') {
      // Keep English accessible even when the browser blocks local storage.
      destination.searchParams.set('lang', 'en');
      link.href = destination.pathname + destination.search + destination.hash;
    }
  });

  // Existing language-specific URLs remain directly accessible and indexable.
  if (location.pathname !== '/' && location.pathname !== '/index.html') return;
  const current = new URL(location.href);
  const requested = current.searchParams.get('lang');
  let saved;
  try {
    saved = localStorage.getItem(preference);
  } catch {
    // Automatic selection still works when storage is unavailable.
  }
  const primary = navigator.languages?.[0] || navigator.language || 'en';
  const automatic = /^es(?:[-_]|$)/i.test(primary) ? 'es' : 'en';
  const language = valid(requested) ? requested : valid(saved) ? saved : automatic;
  if (valid(requested) && remember(requested)) {
    current.searchParams.delete('lang');
    try {
      history.replaceState(null, '', current.pathname + current.search + current.hash);
    } catch {
      // The language choice also works without changing the address bar.
    }
  }
  if (language === 'es') {
    current.pathname = '/es';
    location.replace(current.pathname + current.search + current.hash);
  }
})();
