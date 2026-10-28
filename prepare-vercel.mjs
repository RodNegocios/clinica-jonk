import fs from 'node:fs/promises';

// The site is already built. Only its public metadata needs the new hosting URL.
const address = process.env.SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
if (!address) {
  console.log('Static files are ready. Set SITE_URL to generate absolute sharing URLs outside Vercel.');
} else {
  const url = new URL(address.includes('://') ? address : `https://${address}`);
  if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) {
    throw new Error('SITE_URL must be an HTTP(S) website address without credentials.');
  }
  const origin = url.origin;
  const image = `${origin}/assets/fachada.webp`;
  const page = new URL('./dist/index.html', import.meta.url);
  let html = await fs.readFile(page, 'utf8');
  html = html.replace(/(<meta property="og:url" content=")[^"]*(">)/, `$1${origin}/$2`);
  html = html.replace(/(<meta property="og:image" content=")[^"]*(">)/, `$1${image}$2`);
  html = html.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/, (_, json) => {
    const data = JSON.parse(json);
    data.url = `${origin}/`;
    data.image = image;
    return `<script type="application/ld+json">${JSON.stringify(data).replaceAll('<', '\\u003c')}</script>`;
  });
  html = html.replace(/\s*<link rel="canonical" href="[^"]*">/g, '');
  html = html.replace('</head>', `  <link rel="canonical" href="${origin}/">\n</head>`);
  await fs.writeFile(page, html);
  console.log(`Static site prepared for ${origin}`);
}
