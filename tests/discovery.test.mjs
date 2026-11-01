import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const { JSDOM } = await import(process.env.NOVIK_JSDOM_MODULE || 'jsdom');

const origin = 'https://novik.ai';
const config = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'));
const routes = new Map(config.rewrites.map(({ source, destination }) => [source, destination]));
const staticFile = name => readFile(new URL(`../redesign/static/${name}`, import.meta.url), 'utf8');

test('sitemap contains exactly the canonical routed pages and reciprocal language alternatives', async () => {
  const sitemap = new JSDOM(await staticFile('sitemap.xml'), { contentType: 'text/xml' });
  try {
    const entries = [...sitemap.window.document.getElementsByTagName('url')];
    const locations = entries.map(entry => entry.getElementsByTagName('loc')[0].textContent);
    assert.equal(new Set(locations).size, locations.length, 'No duplicate sitemap locations');
    assert.deepEqual([...locations].sort(), [...routes.keys()].map(route => origin + route).sort());
    for (const entry of entries) {
      const canonical = entry.getElementsByTagName('loc')[0].textContent;
      const route = new URL(canonical).pathname;
      const dom = new JSDOM(await staticFile(routes.get(route).slice(1)));
      try {
        assert.equal(dom.window.document.querySelector('link[rel="canonical"]').href, canonical, route);
        const en = route === '/es' ? '/' : route.replace(/^\/es\//, '/');
        const es = en === '/' ? '/es' : '/es' + en;
        const expected = { en: origin + en, es: origin + es, 'x-default': origin + en };
        const alternates = [...entry.getElementsByTagNameNS('http://www.w3.org/1999/xhtml', 'link')];
        assert.equal(alternates.length, 3, route);
        for (const [language, href] of Object.entries(expected)) {
          assert.equal(alternates.find(link => link.getAttribute('hreflang') === language)?.getAttribute('href'), href, route);
          assert.equal(dom.window.document.querySelector(`link[hreflang="${language}"]`)?.href, href, route);
        }
      } finally { dom.window.close(); }
    }
  } finally { sitemap.window.close(); }
});

test('clinical topics remain discoverable through HTML links and the supplementary machine-readable index', async () => {
  const llms = await staticFile('llms.txt');
  const indexed = [...llms.matchAll(/\]\((https:\/\/novik\.ai[^)]+)\)/g)].map(match => match[1]);
  for (const url of indexed) assert.ok(routes.has(new URL(url).pathname), `Index points to an unrouted page: ${url}`);
  const incoming = new Map([...routes.keys()].map(route => [route, new Set()]));
  for (const [source, destination] of routes) {
    const dom = new JSDOM(await staticFile(destination.slice(1)));
    try {
      for (const link of dom.window.document.querySelectorAll('a[href]')) {
        const target = link.getAttribute('href');
        if (target !== source && incoming.has(target)) incoming.get(target).add(source);
      }
    } finally { dom.window.close(); }
  }
  for (const route of routes.keys()) {
    if (!route.includes('/clinical-topics')) continue;
    assert.ok(indexed.includes(origin + route), `Missing from llms.txt: ${route}`);
    assert.ok(incoming.get(route).size > 0, `Orphaned clinical page: ${route}`);
    const homepage = route.startsWith('/es/') ? '/es' : '/';
    assert.ok(incoming.get(route).has(homepage), `Not linked from its language homepage: ${route}`);
  }
});
