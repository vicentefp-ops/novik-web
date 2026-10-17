import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const { JSDOM } = await import(process.env.NOVIK_JSDOM_MODULE || 'jsdom');
const source = await readFile(new URL('../redesign/static/analytics-consent.js', import.meta.url), 'utf8');
const id = 'G-1MJQ1L5JPN';
async function browser(url = 'https://novik.ai/?email=fictional@example.test&patient=TEST#clinical', cookie = '') {
  const dom = new JSDOM('<!doctype html><html lang="es" data-novik-app="false"><head><title>Novik</title></head><body><main><input value="FICTIONAL CLINICAL DATA"></main></body></html>', { url, runScripts: 'outside-only', referrer: 'https://example.test/private?email=fictional@example.test' });
  if (cookie) dom.window.document.cookie = cookie;
  dom.window.eval(source);
  await new Promise(resolve => setImmediate(resolve));
  return dom;
}
const commands = dom => dom.window.dataLayer.map(args => Array.from(args));
const click = (dom, choice) => dom.window.document.querySelector('[data-cookie=' + choice + ']').click();

test('Google is not loaded or sent a pageview until analytics consent; necessary-only persists', async () => {
  const dom = await browser();
  try {
    assert.equal(dom.window.document.querySelector('#novik-google-analytics'), null);
    assert.equal(commands(dom).some(c => c[0] === 'config' || c[0] === 'event'), false);
    assert.equal(dom.window['ga-disable-' + id], true);
    click(dom, 'reject');
    assert.match(dom.window.document.cookie, /novik_analytics_consent_v1=necessary/);
    assert.equal(dom.window.document.querySelector('#novik-cookie-panel').hidden, true);
    assert.equal(dom.window.document.querySelector('#novik-google-analytics'), null);
    const returning = await browser(undefined, dom.window.document.cookie);
    assert.equal(returning.window.document.querySelector('#novik-cookie-panel').hidden, true);
    assert.equal(returning.window.document.querySelector('#novik-google-analytics'), null);
    returning.window.close();
  } finally { dom.window.close(); }
});

test('consent loads the existing property once and sends only safe pageviews through SPA navigation', async () => {
  const dom = await browser();
  try {
    click(dom, 'accept');
    assert.equal(dom.window.document.querySelectorAll('script[src*="googletagmanager.com"]').length, 1);
    const config = commands(dom).find(c => c[0] === 'config');
    assert.equal(config[1], id);
    assert.equal(config[2].send_page_view, false);
    assert.equal(config[2].allow_google_signals, false);
    let events = commands(dom).filter(c => c[0] === 'event');
    assert.equal(events.length, 1);
    assert.equal(events[0][2].page_location, 'https://novik.ai/');
    assert.equal(events[0][2].page_referrer, 'https://example.test/');
    dom.window.history.pushState({}, '', '/faqs?private=TEST');
    dom.window.history.replaceState({}, '', '/faqs?private=OTHER#fragment');
    dom.window.history.pushState({}, '', '/case/fictional-patient-id');
    events = commands(dom).filter(c => c[0] === 'event');
    assert.equal(events.length, 3);
    assert.equal(events.at(-1)[2].page_path, '/other');
    assert.equal(events[1][2].page_path, '/faqs');
    const serialized = JSON.stringify(commands(dom));
    for (const privateValue of ['fictional@example.test', 'patient', 'FICTIONAL CLINICAL DATA', 'private=', 'fictional-patient-id']) assert.equal(serialized.includes(privateValue), false);
  } finally { dom.window.close(); }
});

test('withdrawal stops future navigation measurement, clears analytics cookies and keeps the clinical draft', async () => {
  const dom = await browser();
  try {
    click(dom, 'accept');
    dom.window.document.cookie = '_ga=fixture; Domain=novik.ai; Path=/; Secure';
    dom.window.document.querySelector('#novik-cookie-open').click();
    click(dom, 'reject');
    const count = commands(dom).filter(c => c[0] === 'event').length;
    dom.window.history.pushState({}, '', '/admin/users');
    assert.equal(commands(dom).filter(c => c[0] === 'event').length, count);
    assert.equal(dom.window['ga-disable-' + id], true);
    assert.equal(dom.window.document.cookie.includes('_ga='), false);
    assert.equal(dom.window.document.querySelector('main input').value, 'FICTIONAL CLINICAL DATA');
    assert.match(dom.window.document.cookie, /novik_analytics_consent_v1=necessary/);
  } finally { dom.window.close(); }
});

test('all twenty static pages have distinct metadata, reciprocal languages, real H1 and the consent loader', async () => {
  const config = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'));
  const titles = new Set();
  for (const {source: route, destination} of config.rewrites) {
    const html = await readFile(new URL('../redesign/static' + destination, import.meta.url), 'utf8');
    const dom = new JSDOM(html, { url: 'https://novik.ai' + route });
    const doc = dom.window.document;
    assert.equal(doc.querySelectorAll('h1').length, 1, route);
    assert.equal(doc.querySelector('link[rel=canonical]').href, 'https://novik.ai' + route, route);
    assert.match(doc.querySelector('meta[name=robots]').content, /^index,follow/);
    assert.ok(doc.querySelector('meta[name=description]').content.length > 40, route);
    assert.ok(!titles.has(doc.title), route); titles.add(doc.title);
    assert.equal(doc.documentElement.lang, route.startsWith('/es') ? 'es' : 'en');
    for (const lang of ['es','en']) assert.ok(doc.querySelector('link[hreflang=' + lang + ']'), route);
    assert.equal(doc.querySelectorAll('script[src^="/analytics-consent.js"]').length, 1, route);
    assert.equal(doc.querySelectorAll('script[src*=googletagmanager]').length, 0, route);
    dom.window.close();
  }
  assert.equal(titles.size, 20);
});
