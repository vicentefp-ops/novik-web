# Novik discovery maintenance — 1 November 2026

Baseline: main `d55c3e1031d356f774471a3b1fecdb183518b5a1`.

## Verified, not new work

- Production is the static `redesign/static` site copied by `scripts/build-static.mjs`, with 28 bilingual routes in `vercel.json`. The older redesign README describes an earlier preview and is not the current deployment guide.
- All eight clinical-topic URLs returned HTTP 200 with self-canonical metadata in a live check on this date.
- Both topic hubs and all six articles already have HTML links from their own language homepage. They are not orphaned pages.
- Sitemap, canonical links and reciprocal EN/ES/x-default alternatives match the 28 configured routes.
- Consent and language-selection tests remain in place; no analytics settings were changed.

## This change

The existing supplementary `llms.txt` inventory omitted the eight clinical pages introduced in October. Add those links, preserving the published clinical scope and limitations. This is inventory maintenance, not evidence that an AI system reads the file or that rankings/citations will improve. HTML navigation and the XML sitemap remain the primary discovery paths.

Add automated regression checks for exact sitemap coverage, canonical/hreflang alignment, valid inventory destinations and homepage links to clinical pages. The new inventory test failed against the baseline and passed after the correction.

No design, clinical article, pricing, consent, application backend, deployment configuration, or production branch change is included. The current task does not merge or deploy production.

## Validation

Run `npm run build` (the complete dependency-free static production build) and `npm test` (requires jsdom). Tests also support an existing jsdom installation via `NOVIK_JSDOM_MODULE=/absolute/path/to/jsdom/lib/api.js`.

A future authorized release should verify `/llms.txt`, `/sitemap.xml`, both homepage language links and the clinical routes on production after deployment. Revert the change commit to roll back this inventory update; no data migration is involved.

Observed local results: full static build passed (28 pages), all 12 tests passed, and `git diff --check` passed. Dependencies were installed from the existing lockfile with lifecycle scripts disabled. `npm run lint` is not green: the legacy TypeScript application references undeclared dependencies such as Firebase, Recharts and react-i18next. The unmodified baseline was checked with the same dependencies and produced the identical errors. This maintenance change does not alter that legacy application or claim its type-check passes.
