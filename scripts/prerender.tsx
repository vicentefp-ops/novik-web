import fs from 'node:fs/promises';
import path from 'node:path';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AppContent } from '../src/App';

const routes = ['/', '/faqs', '/why-free', '/partners', '/api', '/contact'];
const distDir = path.resolve('dist');
const metadata: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'Novik AI – Clinical Excellence in Dentistry Powered by Artificial Intelligence',
    description: 'Novik AI is the leading clinical decision assistant for dentists. Use AI to analyze complex cases, drug interactions, and treatment plans with medical evidence.',
  },
  '/faqs': {
    title: 'FAQs – Common Questions about Novik AI Dental Assistant',
    description: 'Find answers to common questions about Novik AI, including security, compliance, pricing, and how its clinical intelligence supports dental practices.',
  },
  '/why-free': {
    title: 'Why Novik is Free – Our Commitment to Open Clinical AI',
    description: 'Learn why Novik AI offers free access to clinical decision support tools and how we democratize clinical intelligence in dentistry.',
  },
  '/partners': {
    title: 'Partnership – Grow with the Specialized Dental AI Platform',
    description: 'Partner with Novik AI to reach dental professionals and align your organization with innovation and evidence-based oral healthcare.',
  },
  '/api': {
    title: 'Dental AI API – Integrate Clinical Intelligence',
    description: 'Explore the Novik AI API and embed clinical decision support for medications and anesthetics into dental and healthcare software.',
  },
  '/contact': {
    title: 'Contact the Novik AI Dental Clinical Support Team',
    description: 'Contact Novik AI for clinical support, partnerships, product feedback, or dental software API and integration enquiries.',
  },
};

function replaceSeoHead(html: string, route: string) {
  const clean = html
    .replace(/\s*<title>.*?<\/title>/s, '')
    .replace(/\s*<meta name="description"[^>]*>/s, '')
    .replace(/\s*<link rel="canonical"[^>]*>/s, '');

  const page = metadata[route];
  const canonical = `https://novik.ai${route}`;
  const seo = [
    `<title>${page.title}</title>`,
    `<meta name="description" content="${page.description}" />`,
    `<link rel="canonical" href="${canonical}" />`,
  ].join('\n    ');

  return clean.replace('</head>', `    ${seo}\n  </head>`);
}

async function prerender() {
  const template = await fs.readFile(path.join(distDir, 'index.html'), 'utf8');

  for (const route of routes) {
    const helmetContext: Record<string, any> = {};
    const markup = renderToString(
      <HelmetProvider context={helmetContext}>
        <MemoryRouter initialEntries={[route]}>
          <AppContent />
        </MemoryRouter>
      </HelmetProvider>,
    );

    let html = replaceSeoHead(template, route);
    html = html.replace('<div id="root"></div>', `<div id="root">${markup}</div>`);

    const output = route === '/'
      ? path.join(distDir, 'index.html')
      : path.join(distDir, route.slice(1), 'index.html');

    await fs.mkdir(path.dirname(output), { recursive: true });
    await fs.writeFile(output, html);

    if (!html.includes('<h1') || !html.includes(`https://novik.ai${route}`)) {
      throw new Error(`Prerender verification failed for ${route}`);
    }
  }

  console.log(`Prerendered ${routes.length} public routes.`);
}

prerender().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
