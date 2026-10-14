import {cp,mkdir,readdir,readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
await mkdir('dist/assets',{recursive:true});
for(const file of await readdir('public')){if(/\.(png|jpg|jpeg|svg|webp)$/i.test(file)){await cp(path.join('public',file),path.join('dist',file));await cp(path.join('public',file),path.join('dist/assets',file));}}
await cp('redesign/static','dist',{recursive:true});
const config=JSON.parse(await readFile('vercel.json','utf8'));
for(const {source,destination} of config.rewrites){const html=await readFile(path.join('dist',destination),'utf8');if(!html.includes('<h1')||!html.includes('hreflang="es"')||!html.includes('rel="canonical"'))throw new Error(`Invalid page: ${source}`);}
console.log(`Built ${config.rewrites.length} complete bilingual pages.`);
