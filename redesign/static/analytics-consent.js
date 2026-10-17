(() => {
  'use strict';
  const id = 'G-1MJQ1L5JPN';
  const preference = 'novik_analytics_consent_v1';
  const app = location.hostname === 'app.novik.ai' || document.documentElement.dataset.novikApp === 'true';
  const publicPaths = new Set(['/', '/why-free', '/partners', '/api', '/faqs', '/contact', '/legal-notice', '/terms-of-use', '/privacy-policy', '/cookie-policy']);
  const appPaths = new Set(['/', '/login', '/onboarding', '/settings', '/admin/users', '/admin/banners', '/admin/protocols', '/admin/leaflets', '/legal-notice', '/terms-of-use', '/privacy-policy']);
  const production = ['novik.ai', 'app.novik.ai'].includes(location.hostname);
  const domain = production ? '; Domain=novik.ai' : '';
  const readChoice = () => document.cookie.split('; ').find(c => c.startsWith(preference + '='))?.split('=')[1];
  let enabled = false, configured = false, previousPage = '', panel, opener;
  window['ga-disable-' + id] = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  const denied = { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' };
  window.gtag('consent', 'default', denied);

  function safePath() {
    const path = location.pathname.replace(/\/$/, '') || '/';
    if (app) return appPaths.has(path) ? path : '/other';
    const english = path.replace(/^\/es(?=\/|$)/, '') || '/';
    return publicPaths.has(english) ? path : '/other';
  }
  function safeReferrer() {
    try {
      const url = new URL(document.referrer);
      // External referrers retain attribution without query strings or paths.
      return url.origin + '/';
    } catch { return ''; }
  }
  function pageView() {
    if (!enabled || !production) return;
    const path = safePath();
    const key = location.hostname + path;
    if (key === previousPage) return;
    previousPage = key;
    const parameters = {
      page_location: location.origin + path,
      page_path: path,
      page_title: app ? 'Novik · Aplicación' : document.title,
      page_referrer: safeReferrer(),
    };
    window.gtag('set', parameters);
    window.gtag('event', 'page_view', { ...parameters, send_to: id });
  }
  function clearAnalyticsCookies() {
    for (const entry of document.cookie.split(';')) {
      const name = entry.trim().split('=')[0];
      if (!/^_ga(?:_|$)|^_gid$|^_gat/.test(name)) continue;
      for (const scope of ['', '; Domain=' + location.hostname, domain])
        document.cookie = name + '=; Max-Age=0; Path=/' + scope + '; SameSite=Lax; Secure';
    }
  }
  function applyChoice(choice, remember = false) {
    enabled = choice === 'all';
    window['ga-disable-' + id] = !enabled;
    if (remember) document.cookie = preference + '=' + choice + '; Max-Age=15552000; Path=/' + domain + '; SameSite=Lax; Secure';
    window.gtag('consent', 'update', { ...denied, analytics_storage: enabled ? 'granted' : 'denied' });
    if (!enabled) {
      previousPage = '';
      clearAnalyticsCookies();
      return;
    }
    if (!configured && production) {
      configured = true;
      window.gtag('js', new Date());
      window.gtag('config', id, {
        send_page_view: false,
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
        page_location: location.origin + safePath(),
        page_referrer: safeReferrer(),
        page_title: app ? 'Novik · Aplicación' : document.title,
      });
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
      script.id = 'novik-google-analytics';
      document.head.appendChild(script);
    }
    pageView();
  }
  const copy = () => document.documentElement.lang.startsWith('es') ? {
    title: 'Tú decides sobre las cookies',
    text: 'Usamos cookies necesarias para que Novik funcione. Solo con tu permiso activamos Google Analytics para medir la navegación. No enviamos datos de pacientes ni consultas clínicas.',
    accept: 'Aceptar analítica', reject: 'Solo necesarias', settings: 'Cookies', policy: 'Política de cookies', href: 'https://novik.ai/es/cookie-policy',
  } : {
    title: 'Your choice about cookies',
    text: 'We use necessary cookies to operate Novik. With your permission, we enable Google Analytics to measure navigation. We do not send patient data or clinical queries.',
    accept: 'Accept analytics', reject: 'Necessary only', settings: 'Cookies', policy: 'Cookie policy', href: 'https://novik.ai/cookie-policy',
  };
  function updateCopy() {
    const words = copy();
    for (const key of ['title', 'text', 'accept', 'reject', 'policy']) panel.querySelector('[data-cookie=' + key + ']').textContent = words[key];
    panel.querySelector('a').href = words.href;
    opener.textContent = words.settings;
    opener.setAttribute('aria-label', document.documentElement.lang.startsWith('es') ? 'Configurar cookies' : 'Cookie settings');
  }
  function showPanel(show) {
    panel.hidden = !show;
    opener.setAttribute('aria-expanded', String(show));
  }
  function ready() {
    const style = document.createElement('style');
    style.textContent = `#novik-cookie-panel,#novik-cookie-open{box-sizing:border-box;font:inherit;font-size:13px;line-height:1.6;color:#27331b}#novik-cookie-panel{position:fixed;bottom:18px;left:18px;z-index:10000;background:#fff;border:1px solid #cbd4bf;border-radius:16px;box-shadow:0 12px 45px #27331b25;padding:22px;width:min(570px,calc(100% - 36px));max-height:calc(100vh - 36px);overflow:auto}#novik-cookie-panel[hidden]{display:none}#novik-cookie-panel h2{font:inherit;font-weight:700;font-size:17px;margin:0 0 8px}#novik-cookie-panel p{font:inherit;margin:0 0 12px}#novik-cookie-panel a{color:#405321;text-decoration:underline}#novik-cookie-panel .novik-cookie-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:16px}#novik-cookie-panel button,#novik-cookie-open{cursor:pointer;border:1px solid #485b32;border-radius:8px;padding:10px 16px;min-height:44px;font:inherit;font-weight:600;background:#fff;color:#27331b}#novik-cookie-panel button{flex:1}#novik-cookie-panel [data-cookie=accept]{background:#485b32;color:#fff}#novik-cookie-open{position:fixed;bottom:10px;left:10px;z-index:9999;font-size:11px;padding:4px 10px;min-height:34px;background:#fff}#novik-cookie-panel :focus-visible,#novik-cookie-open:focus-visible{outline:3px solid #7d922f;outline-offset:3px}`;
    document.head.appendChild(style);
    panel = document.createElement('section');
    panel.id = 'novik-cookie-panel';
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-labelledby', 'novik-cookie-title');
    panel.innerHTML = '<h2 id="novik-cookie-title" data-cookie="title"></h2><p data-cookie="text"></p><a data-cookie="policy"></a><div class="novik-cookie-actions"><button type="button" data-cookie="reject"></button><button type="button" data-cookie="accept"></button></div>';
    opener = document.createElement('button');
    opener.id = 'novik-cookie-open';
    opener.type = 'button';
    opener.setAttribute('aria-controls', panel.id);
    opener.addEventListener('click', () => { showPanel(true); panel.querySelector('button').focus(); });
    for (const [key, value] of [['accept', 'all'], ['reject', 'necessary']]) panel.querySelector('[data-cookie=' + key + ']').addEventListener('click', () => { applyChoice(value, true); showPanel(false); opener.focus(); });
    document.body.append(opener, panel);
    updateCopy();
    const choice = readChoice();
    applyChoice(choice);
    showPanel(!['all', 'necessary'].includes(choice));
    new MutationObserver(updateCopy).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    // React Router navigation is measured once; hashes, parameters and form contents never enter the payload.
    for (const method of ['pushState', 'replaceState']) {
      const original = history[method];
      history[method] = function (...args) { const result = original.apply(this, args); pageView(); return result; };
    }
    window.addEventListener('popstate', pageView);
    window.addEventListener('pageshow', () => {
      const current = readChoice();
      if ((current === 'all') !== enabled) applyChoice(current);
    });
    // A preference changed on the other Novik subdomain applies when returning to this tab.
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) applyChoice(readChoice());
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready, { once: true });
  else ready();
})();
