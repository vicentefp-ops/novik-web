import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';
const { JSDOM } = await import(process.env.NOVIK_JSDOM_MODULE || 'jsdom');

const source = await readFile(new URL('../redesign/static/language.js', import.meta.url), 'utf8');
function browser({ url = 'https://novik.ai/', languages = ['es-ES'], language = 'es-ES', saved, blocked = false } = {}) {
  const dom = new JSDOM('<html><body><div class="languages"><a href="/">EN</a><a href="/es">ES</a></div></body></html>', { url });
  const location = new URL(url);
  const redirects = [];
  const addresses = [];
  const storage = new Map(saved === undefined ? [] : [['novik_web_language', saved]]);
  location.replace = destination => redirects.push(destination);
  runInNewContext(source, {
    document: dom.window.document,
    location,
    navigator: { languages, language },
    localStorage: {
      getItem(key) { if (blocked) throw new Error('Storage blocked'); return storage.get(key) ?? null; },
      setItem(key, value) { if (blocked) throw new Error('Storage blocked'); storage.set(key, value); },
    },
    history: { replaceState(_state, _title, address) { addresses.push(address); } },
    URL,
  });
  // Observe link handling without asking jsdom to navigate to a different page.
  dom.window.document.addEventListener('click', event => event.preventDefault());
  return { dom, redirects, addresses, storage };
}

test('the homepage defaults to Spanish for every Spanish device locale, preserving query and hash', () => {
  for (const language of ['es', 'es-ES', 'es-MX', 'es-419', 'ES-ar', 'es_ES']) {
    const b = browser({ languages: [language], url: 'https://novik.ai/?utm_source=fixture#evidence' });
    try {
      assert.deepEqual(b.redirects, ['/es?utm_source=fixture#evidence'], language);
      assert.equal(b.storage.size, 0, 'Automatic detection must not become a permanent manual preference');
    } finally { b.dom.window.close(); }
  }
});

test('all other primary languages default to English, including when Spanish is a secondary preference', () => {
  for (const language of ['en', 'en-US', 'fr-FR', 'de-DE', 'pt-BR', 'ca-ES', 'et-EE', 'est', '']) {
    const b = browser({ languages: [language, 'es-ES'], language });
    try { assert.deepEqual(b.redirects, [], language); } finally { b.dom.window.close(); }
  }
});

test('navigator.language is the fallback and saved manual choices override automatic selection', () => {
  for (const [options, expected] of [
    [{ languages: [], language: 'es-MX' }, ['/es']],
    [{ languages: [], language: '' }, []],
    [{ saved: 'en' }, []],
    [{ saved: 'es', languages: ['en-US'] }, ['/es']],
    [{ saved: 'invalid' }, ['/es']],
    [{ url: 'https://novik.ai/index.html' }, ['/es']],
  ]) {
    const b = browser(options);
    try { assert.deepEqual(b.redirects, expected); } finally { b.dom.window.close(); }
  }
});

test('direct Spanish and English pages never bounce between language variants', () => {
  for (const url of ['https://novik.ai/es', 'https://novik.ai/faqs', 'https://novik.ai/es/faqs']) {
    for (const languages of [['es-ES'], ['en-US'], ['fr-FR']]) {
      const b = browser({ url, languages });
      try { assert.deepEqual(b.redirects, []); } finally { b.dom.window.close(); }
    }
  }
});

test('the language selector remembers explicit choices and English stays accessible with storage blocked', () => {
  const b = browser({ url: 'https://novik.ai/es' });
  try {
    b.dom.window.document.querySelector('.languages a').click();
    assert.equal(b.storage.get('novik_web_language'), 'en');
    b.dom.window.document.querySelector('.languages a[href="/es"]').click();
    assert.equal(b.storage.get('novik_web_language'), 'es');
  } finally { b.dom.window.close(); }
  const blocked = browser({ url: 'https://novik.ai/es', blocked: true });
  try {
    const english = blocked.dom.window.document.querySelector('.languages a');
    english.click();
    assert.equal(english.getAttribute('href'), '/?lang=en');
  } finally { blocked.dom.window.close(); }
  for (const [url, expected] of [['https://novik.ai/?lang=en', []], ['https://novik.ai/', ['/es']]]) {
    const b = browser({ url, blocked: true });
    try { assert.deepEqual(b.redirects, expected); } finally { b.dom.window.close(); }
  }
});

test('an explicit homepage choice is cleaned from the URL when it can be remembered', () => {
  const b = browser({ url: 'https://novik.ai/?lang=en&utm_source=fixture#evidence' });
  try {
    assert.deepEqual(b.redirects, []);
    assert.deepEqual(b.addresses, ['/?utm_source=fixture#evidence']);
    assert.equal(b.storage.get('novik_web_language'), 'en');
  } finally { b.dom.window.close(); }
});
