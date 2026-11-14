import fs from 'node:fs';import path from 'node:path';import {parseHTML} from 'linkedom';import {parse} from 'acorn';
const dict=JSON.parse(fs.readFileSync('translations.en.json','utf8'));
const routes=JSON.parse(fs.readFileSync('routes.json','utf8'));
const translate=s=>{if(dict[s]!==undefined)return dict[s];const trim=s.trim();return dict[trim]!==undefined?s.replace(trim,dict[trim]):s};
const enPath=s=>s.replaceAll('/it/','/en/');
for(const route of routes){
 const file=path.join('dist/it',route.slug,'index.html');const {document:it}=parseHTML(fs.readFileSync(file,'utf8'));
 const switcher=it.createElement('div');switcher.className='language-switch';switcher.setAttribute('role','group');switcher.setAttribute('aria-label','Lingua / Language');
 for(const lang of ['it','en']){const a=it.createElement('a');a.textContent=lang.toUpperCase();a.href=`/${lang}/${route.slug}${route.slug?'/':''}`;a.hreflang=lang;a.lang=lang;a.setAttribute('aria-label',lang==='it'?'Italiano':'English');a.dataset.language=lang;if(lang==='it')a.setAttribute('aria-current','true');switcher.append(a)}
 it.querySelector('.header').insertBefore(switcher,it.querySelector('.menu-toggle'));
 const alt=it.createElement('link');alt.rel='alternate';alt.hreflang='en';alt.href=enPath(route.url);it.head.append(alt);
 fs.writeFileSync(file,it.toString());
 const {document}=parseHTML(it.toString());document.documentElement.lang='en';
 // Keep option values stable: filters and language preferences use internal Italian values.
 for(const option of document.querySelectorAll('option'))if(!option.hasAttribute('value'))option.setAttribute('value',option.textContent);
 function walk(node){for(const child of [...node.childNodes]){if(child.nodeType===3)child.textContent=translate(child.textContent);else if(child.nodeType===1&&!['SCRIPT','STYLE'].includes(child.tagName))walk(child)}}walk(document.documentElement);
 for(const el of document.querySelectorAll('*')){
  for(const attr of ['alt','title','aria-label','placeholder','data-title'])if(el.hasAttribute(attr))el.setAttribute(attr,translate(el.getAttribute(attr)));
  if(el.tagName==='META'&&['description','og:title','og:description','og:image:alt'].includes(el.getAttribute('name')||el.getAttribute('property')))el.setAttribute('content',translate(el.getAttribute('content')));
  if(el.tagName==='META'&&el.getAttribute('property')==='og:locale')el.setAttribute('content','en_GB');
  if(el.tagName==='META'&&el.getAttribute('property')==='og:url')el.setAttribute('content',enPath(el.getAttribute('content')));
  for(const attr of ['href','action'])if(el.hasAttribute(attr)&&!el.closest('.language-switch')&&!(el.tagName==='LINK'&&el.getAttribute('rel')==='alternate'))el.setAttribute(attr,enPath(el.getAttribute(attr)));
 }
 for(const a of document.querySelectorAll('.language-switch a')){a.removeAttribute('aria-current');if(a.dataset.language==='en')a.setAttribute('aria-current','true')}
 for(const script of document.querySelectorAll('script[type="application/ld+json"],script[type="application/json"]')){
  const data=JSON.parse(script.textContent);function convert(o){if(Array.isArray(o))return o.map(convert);if(o&&typeof o==='object')return Object.fromEntries(Object.entries(o).map(([k,v])=>[k,k==='inLanguage'?'en':convert(v)]));return typeof o==='string'?enPath(translate(o)):o}script.textContent=JSON.stringify(convert(data)).replaceAll('<','\\u003c');
 }
 for(const script of document.querySelectorAll('script[src]')){const src=script.getAttribute('src');if(['/app.js','/order.js'].includes(src))script.setAttribute('src',src.replace('.js','.en.js'))}
 for(const option of document.querySelectorAll('#trip-form option'))option.setAttribute('value',translate(option.getAttribute('value')));
 for(const input of document.querySelectorAll('#trip-form input[type=checkbox],#trip-form input[type=radio]'))input.setAttribute('value',translate(input.getAttribute('value')));
 const dest=path.join('dist/en',route.slug);fs.mkdirSync(dest,{recursive:true});fs.writeFileSync(path.join(dest,'index.html'),document.toString());
}
// Translate displayed JS strings, leaving property keys and functional option values intact.
const keep=new Set(['Italiano','English','Tiếng Việt']);
for(const f of ['app','order','order-engine']){
 const source=fs.readFileSync(`public/${f}.js`,'utf8'),edits=[];
 function visit(n,parent){if(!n||typeof n!=='object')return;
  if(n.type==='Literal'&&typeof n.value==='string'&&!(parent?.type==='Property'&&parent.key===n&&!parent.computed)){
   let value=keep.has(n.value)?n.value:translate(n.value);value=enPath(value);if(value==='./order-engine.js')value='./order-engine.en.js';if(value!==n.value)edits.push([n.start,n.end,JSON.stringify(value)]);
  }
  if(n.type==='TemplateElement'){const value=translate(n.value.cooked);if(value!==n.value.cooked)edits.push([n.start,n.end,value.replaceAll('\\','\\\\').replaceAll('`','\\`').replaceAll('${','\\${')]);}
  for(const [k,v]of Object.entries(n))if(v&&typeof v==='object'){if(Array.isArray(v))v.forEach(x=>visit(x,n));else visit(v,n)}
 }
 visit(parse(source,{ecmaVersion:'latest',sourceType:'module'}));let output=source;for(const [a,b,value]of edits.sort((a,b)=>b[0]-a[0]))output=output.slice(0,a)+value+output.slice(b);parse(output,{ecmaVersion:'latest',sourceType:'module'});fs.writeFileSync(`dist/${f}.en.js`,output);
}
console.log(`Built ${routes.length} English pages and translated interactive scripts.`);
