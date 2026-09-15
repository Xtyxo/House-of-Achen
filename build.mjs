import { mkdir, writeFile, readFile, copyFile, access } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const ORIGIN = 'https://house-of-achen-life-hq.netlify.app';
const OUT = 'dist';
const pages = Array.from({ length: 20 }, (_, i) => `beauty-babe/pages/page-${String(i + 1).padStart(2, '0')}.png`);
const mirrored = [
  'index.html',
  'manifest.webmanifest',
  'service-worker.js',
  'icon-192.png',
  'icon-512.png',
  'icon.svg',
  'data/live.json',
  'beauty-babe/Its_Beauty_Babe_Mini_Beauty_Bible_Aug_2026.pdf',
  ...pages,
];

async function ensureParent(file) {
  await mkdir(dirname(join(OUT, file)), { recursive: true });
}

async function fetchFile(file) {
  const url = `${ORIGIN}/${file}?hoa_source_sync=${Date.now()}`;
  const res = await fetch(url, { headers: { 'user-agent': 'House-of-Achen-Netlify-Build' } });
  if (!res.ok) throw new Error(`Could not mirror ${file}: ${res.status} ${res.statusText}`);
  await ensureParent(file);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(join(OUT, file), buf);
}

for (const file of mirrored) await fetchFile(file);

// If Nova has committed a fresher live-data snapshot to GitHub, prefer that over the mirrored one.
try {
  await access('data/live.json');
  await mkdir(join(OUT, 'data'), { recursive: true });
  await copyFile('data/live.json', join(OUT, 'data/live.json'));
} catch {}

await mkdir(join(OUT, 'overrides'), { recursive: true });
for (const file of ['app.css', 'app.js', 'crochet.css', 'crochet.js', 'finance.css', 'finance.js']) {
  try { await copyFile(join('overrides', file), join(OUT, 'overrides', file)); } catch {}
}

const buildId = process.env.COMMIT_REF?.slice(0, 10) || String(Date.now());
let html = await readFile(join(OUT, 'index.html'), 'utf8');
const cssTag = '<link rel="stylesheet" href="./overrides/app.css">';
const crochetCssTag = `<link rel="stylesheet" href="./overrides/crochet.css?v=${buildId}">`;
const financeCssTag = `<link rel="stylesheet" href="./overrides/finance.css?v=${buildId}">`;
const jsTag = '<script src="./overrides/app.js"></script>';
const crochetJsTag = `<script src="./overrides/crochet.js?v=${buildId}"></script>`;
const financeJsTag = `<script src="./overrides/finance.js?v=${buildId}"></script>`;
if (!html.includes(cssTag)) html = html.replace('</head>', `  ${cssTag}\n</head>`);
if (!html.includes('overrides/crochet.css')) html = html.replace('</head>', `  ${crochetCssTag}\n</head>`);
if (!html.includes('overrides/finance.css')) html = html.replace('</head>', `  ${financeCssTag}\n</head>`);
if (!html.includes(jsTag)) html = html.replace('</body>', `  ${jsTag}\n</body>`);
if (!html.includes('overrides/crochet.js')) html = html.replace('</body>', `  ${crochetJsTag}\n</body>`);
if (!html.includes('overrides/finance.js')) html = html.replace('</body>', `  ${financeJsTag}\n</body>`);
html = html.replace(/<meta name="theme-color" content="[^"]*">/i, '<meta name="theme-color" content="#29224D">');
await writeFile(join(OUT, 'index.html'), html);

// Match installed PWA chrome to the premium midnight/lavender refresh.
try {
  const manifestPath = join(OUT, 'manifest.webmanifest');
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  manifest.theme_color = '#29224D';
  manifest.background_color = '#FAF7FF';
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2));
} catch (error) {
  console.warn('Could not recolor manifest:', error.message);
}

// Change the cache name on every Git-backed deploy so phones do not stay stuck on an older app shell.
const swPath = join(OUT, 'service-worker.js');
let sw = await readFile(swPath, 'utf8');
sw = sw.replace(/const CACHE='[^']*';/, `const CACHE='house-of-achen-git-${buildId}';`);
await writeFile(swPath, sw);

console.log(`House of Achen build ready in ${OUT}. Mirrored ${mirrored.length} production assets and applied GitHub overrides.`);
