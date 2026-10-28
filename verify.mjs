import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const html=await fs.readFile('dist/index.html','utf8');
const css=await fs.readFile('dist/styles.css','utf8');
const js=await fs.readFile('dist/app.js','utf8');
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
assert.equal(new Set(ids).size,ids.length,'Unique HTML IDs');
for(const [,id] of html.matchAll(/href="#([^"]+)"/g)) assert(ids.includes(id),'Internal anchor '+id);
for(const [,asset] of html.matchAll(/(?:src|href)="(\/(?!\/)[^"]+)"/g)) await fs.access('dist'+asset);
for(const [,url] of html.matchAll(/href="(https:\/\/wa.me\/[^\"]+)"/g)) assert(url.startsWith('https://wa.me/5565999753639'),'Confirmed WhatsApp number');
for(const name of ['doutora','consultorio','acolhimento','consultorio-vertical','radiologia','recepcao','fachada']) {
 assert(html.includes(name+'.webp')||js.includes(name),'Photograph included: '+name);
 await fs.access('dist/assets/'+name+'.webp');
}
assert(css.includes('prefers-reduced-motion:reduce'));
assert(js.includes('prefers-reduced-motion: no-preference'));
assert.equal((html.match(/<h1\b/g)||[]).length,1);
assert(html.includes('CRO-MT 3152'));
const manifest=JSON.parse(await fs.readFile('vercel.json','utf8'));
assert.equal(manifest.outputDirectory,'dist');
assert.equal(manifest.framework,null);
console.log('PASS: anchors, unique IDs, local assets, all seven photographs, WhatsApp, metadata and motion fallback.');
