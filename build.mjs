import { mkdir, writeFile, readFile, copyFile, access } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const ORIGIN = 'https://house-of-achen-life-hq.netlify.app';
const OUT = 'dist';
const PWA_VERSION = 'house-of-achen-pwa-v3';
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
const approvedCatAssets = [
  'assets/cats/luna-full.webp',
  'assets/cats/luna-head.webp',
  'assets/cats/diana-full.webp',
  'assets/cats/diana-head.webp',
];
const appIconAssets = ['icon-192.png', 'icon-512.png'];
const iconAliases = [
  ['icon-192.png', 'pwa-icon-192.png'],
  ['icon-512.png', 'pwa-icon-512.png'],
  ['icon-512.png', 'pwa-maskable-512.png'],
  ['icon-192.png', 'favicon.png'],
  ['icon-512.png', 'apple-touch-icon.png'],
];
const overrideFiles = ['app.css', 'app.js', 'crochet.css', 'crochet.js', 'finance.css', 'finance.js', 'dashboard.css', 'dashboard.js'];

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

try {
  await access('data/live.json');
  await mkdir(join(OUT, 'data'), { recursive: true });
  await copyFile('data/live.json', join(OUT, 'data/live.json'));
} catch {}

for (const file of approvedCatAssets) {
  await access(file);
  await ensureParent(file);
  await copyFile(file, join(OUT, file));
}

for (const file of appIconAssets) {
  await access(file);
  await copyFile(file, join(OUT, file));
}

// Give Android/Chrome completely new icon URLs so an old generated letter tile cannot be reused.
for (const [source, target] of iconAliases) {
  await access(source);
  await copyFile(source, join(OUT, target));
}

await mkdir(join(OUT, 'overrides'), { recursive: true });
for (const file of overrideFiles) {
  try { await copyFile(join('overrides', file), join(OUT, 'overrides', file)); } catch {}
}

const buildId = process.env.COMMIT_REF?.slice(0, 10) || String(Date.now());
let html = await readFile(join(OUT, 'index.html'), 'utf8');

const lunaBootstrap = `function lunaSvg(){return\`<img class="hoa-cat hoa-cat-full hoa-luna" src="./assets/cats/luna-full.webp" alt="Luna, black cat with soft green eyes and a gold crescent moon" draggable="false" decoding="async">\`}`;
const dianaBootstrap = `function dianaSvg(){return\`<img class="hoa-cat hoa-cat-full hoa-diana" src="./assets/cats/diana-full.webp" alt="Diana, gray tabby with a white muzzle and chest, soft green eyes, pearl necklace and pink heart pendant" draggable="false" decoding="async">\`}`;
const lunaLegacyPattern = /function lunaSvg\(\)\{return`<svg class="cat-svg"[\s\S]*?<\/svg>`\}/;
const dianaLegacyPattern = /function dianaSvg\(\)\{return`<svg class="cat-svg"[\s\S]*?<\/svg>`\}/;
html = html.replace(lunaLegacyPattern, lunaBootstrap);
html = html.replace(dianaLegacyPattern, dianaBootstrap);
html = html.replace(
  "document.getElementById('lunaIconMount').innerHTML=lunaSvg();",
  "document.getElementById('lunaIconMount').innerHTML=`<img class=\"hoa-cat hoa-cat-head hoa-luna-head\" src=\"./assets/cats/luna-head.webp\" alt=\"Luna, black cat with soft green eyes and a gold crescent moon\" draggable=\"false\" decoding=\"async\">`;"
);

// Canonical PWA identity. Remove stale declarations, then add fresh Android + shortcut fallbacks.
html = html.replaceAll('icon.svg', 'pwa-icon-512.png');
html = html.replace(/<link\b[^>]*rel=["'][^"']*(?:shortcut\s+icon|apple-touch-icon|icon)[^"']*["'][^>]*>\s*/gi, '');
html = html.replace(/<link\b[^>]*rel=["']manifest["'][^>]*>\s*/gi, '');
html = html.replace(/<meta\b[^>]*name=["'](?:application-name|mobile-web-app-capable|apple-mobile-web-app-capable|apple-mobile-web-app-title)["'][^>]*>\s*/gi, '');
if (/<title>[\s\S]*?<\/title>/i.test(html)) html = html.replace(/<title>[\s\S]*?<\/title>/i, '<title>House of Achen</title>');
else html = html.replace('</head>', '  <title>House of Achen</title>\n</head>');
const pwaHeadTags = [
  `<link rel="shortcut icon" type="image/png" href="/favicon.png?v=${PWA_VERSION}">`,
  `<link rel="icon" type="image/png" sizes="192x192" href="/pwa-icon-192.png?v=${PWA_VERSION}">`,
  `<link rel="icon" type="image/png" sizes="512x512" href="/pwa-icon-512.png?v=${PWA_VERSION}">`,
  `<link rel="apple-touch-icon" href="/apple-touch-icon.png?v=${PWA_VERSION}">`,
  `<link rel="manifest" href="/manifest.webmanifest?v=${PWA_VERSION}">`,
  '<meta name="application-name" content="House of Achen">',
  '<meta name="mobile-web-app-capable" content="yes">',
  '<meta name="apple-mobile-web-app-capable" content="yes">',
  '<meta name="apple-mobile-web-app-title" content="House of Achen">',
].join('\n  ');
html = html.replace('</head>', `  ${pwaHeadTags}\n</head>`);

const cssTags = [
  '<link rel="stylesheet" href="./overrides/app.css">',
  `<link rel="stylesheet" href="./overrides/crochet.css?v=${buildId}">`,
  `<link rel="stylesheet" href="./overrides/finance.css?v=${buildId}">`,
  `<link rel="stylesheet" href="./overrides/dashboard.css?v=${buildId}">`,
];
for (const tag of cssTags) {
  const href = tag.match(/href="([^"]+)/)?.[1]?.split('?')[0];
  if (!href || !html.includes(href)) html = html.replace('</head>', `  ${tag}\n</head>`);
}

const jsTags = [
  '<script src="./overrides/app.js"></script>',
  `<script src="./overrides/crochet.js?v=${buildId}"></script>`,
  `<script src="./overrides/finance.js?v=${buildId}"></script>`,
  `<script src="./overrides/dashboard.js?v=${buildId}"></script>`,
];
for (const tag of jsTags) {
  const src = tag.match(/src="([^"]+)/)?.[1]?.split('?')[0];
  if (!src || !html.includes(src)) html = html.replace('</body>', `  ${tag}\n</body>`);
}

html = html.replace(/<meta name="theme-color" content="[^"]*">/i, '<meta name="theme-color" content="#29224D">');
await writeFile(join(OUT, 'index.html'), html);

try {
  const manifestPath = join(OUT, 'manifest.webmanifest');
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  manifest.name = 'House of Achen';
  manifest.short_name = 'House of Achen';
  manifest.description = 'House of Achen Life HQ';
  manifest.id = `/${PWA_VERSION}`;
  manifest.start_url = `/?pwa=${PWA_VERSION}`;
  manifest.scope = '/';
  manifest.display = 'standalone';
  manifest.display_override = ['standalone', 'minimal-ui'];
  manifest.prefer_related_applications = false;
  manifest.theme_color = '#29224D';
  manifest.background_color = '#FAF7FF';
  manifest.icons = [
    { src: `/pwa-icon-192.png?v=${PWA_VERSION}`, sizes: '192x192', type: 'image/png', purpose: 'any' },
    { src: `/pwa-icon-512.png?v=${PWA_VERSION}`, sizes: '512x512', type: 'image/png', purpose: 'any' },
    { src: `/pwa-maskable-512.png?v=${PWA_VERSION}`, sizes: '512x512', type: 'image/png', purpose: 'maskable' }
  ];
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2));
} catch (error) {
  console.warn('Could not update manifest:', error.message);
}

const swPath = join(OUT, 'service-worker.js');
let sw = await readFile(swPath, 'utf8');
sw = sw.replace(/const CACHE='[^']*';/, `const CACHE='house-of-achen-git-${buildId}';`);
if (!sw.includes('HOUSE_OF_ACHEN_UPDATE_POLICY')) {
  sw += `\n\n// HOUSE_OF_ACHEN_UPDATE_POLICY\nself.addEventListener('install',()=>self.skipWaiting());\nself.addEventListener('activate',(event)=>{\n  event.waitUntil((async()=>{\n    const keys=await caches.keys();\n    await Promise.all(keys.filter((key)=>key!==CACHE).map((key)=>caches.delete(key)));\n    await self.clients.claim();\n  })());\n});\n`;
}
await writeFile(swPath, sw);

console.log(`House of Achen build ready in ${OUT}. Mirrored ${mirrored.length} production assets and applied GitHub overrides.`);
