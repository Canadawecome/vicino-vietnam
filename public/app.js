const menu=document.querySelector('.menu-toggle');
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')==='true';menu.setAttribute('aria-expanded',String(!open));document.querySelector('.header').classList.toggle('menu-open',!open);});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu?.getAttribute('aria-expanded')==='true'){menu.click();menu.focus();}});
const ideas={natura:['Più verde, meno fretta.','Ninh Bình può diventare il cuore del tuo itinerario: tempo sul fiume, passeggiate e soste da scegliere insieme.'],villaggi:['Il tempo di incontrarsi.','Più spazio per piccoli centri e vita quotidiana. Le visite a famiglie e botteghe si organizzano con chi accoglie, quando disponibili.'],cucina:['Un viaggio, tanti sapori.','Mercati e cucina locale come filo del percorso. Assaggi e incontri in cucina saranno da concordare con i fornitori.'],relax:['Fermarsi è parte del viaggio.','Meno cambi di alloggio e più notti nello stesso luogo. Una base comoda, qualche uscita e tempo che resta tuo.']};
document.querySelectorAll('[data-interest]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-interest]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));const key=b.dataset.interest;document.getElementById('interest-title').textContent=ideas[key][0];document.getElementById('interest-copy').textContent=ideas[key][1];document.getElementById('interest-cta').href='/it/crea-il-tuo-viaggio/?interesse='+key;}));
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!reduce&&'IntersectionObserver'in window){const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.animate(e.target.tagName==='FIGURE'||e.target.classList.contains('photo-story')?[{opacity:.65,transform:'translateY(22px) scale(.98)'},{opacity:1,transform:'none'}]:[{opacity:.45,transform:'translateY(20px)'},{opacity:1,transform:'none'}],{duration:800,easing:'cubic-bezier(.16,1,.3,1)',delay:Number(e.target.dataset.delay||0)});obs.unobserve(e.target);}});},{threshold:.10});document.querySelectorAll('.reveal').forEach((el,i)=>{el.dataset.delay=(i%3)*70;obs.observe(el);});}
const form=document.getElementById('trip-form');
if(form){
 let step=0;const fields=[...form.querySelectorAll('fieldset')];const prev=document.getElementById('previous'),next=document.getElementById('next'),restart=document.getElementById('restart');
 const param=new URLSearchParams(location.search).get('interesse');const map={natura:'Natura e paesaggi',villaggi:'Vita nei villaggi',cucina:'Cucina locale',relax:'Relax e comfort'};
 if(map[param])form.querySelectorAll('[name="interessi"]').forEach(x=>x.checked=x.value===map[param]);
 function rows(){const f=new FormData(form);return [...(new URLSearchParams(location.search).get('esperienza')?[['Esperienza',new URLSearchParams(location.search).get('esperienza').slice(0,180)]]:[]),['Periodo',f.get('periodo')||'Da valutare'],['Durata',f.get('durata')],['Viaggiatori',`${f.get('adulti')} adulti, ${f.get('bambini')} bambini`],...(Number(f.get('bambini'))>0?[['Età dei bambini',f.get('eta')||'Da specificare']]:[]),['Budget per persona',f.get('budget')+' (voli internazionali esclusi)'],['Interessi',f.getAll('interessi').join(', ')||'Da valutare'],['Ritmo',f.get('ritmo')],['Guida',f.get('guida')],['Alloggio',f.get('alloggio')]];}
 function summary(){const target=document.getElementById('trip-summary');target.replaceChildren();const dl=document.createElement('dl');for(const [key,value]of rows()){const div=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=key;dd.textContent=value;div.append(dt,dd);dl.append(div);}target.append(dl);}
 function render(focus=false){fields.forEach((x,i)=>x.hidden=i!==step);document.querySelectorAll('.wizard-progress li').forEach((x,i)=>{if(i===step)x.setAttribute('aria-current','step');else x.removeAttribute('aria-current');});prev.hidden=step===0;next.hidden=step===3;restart.hidden=step!==3;document.getElementById('step-status').textContent=`${step+1} di 4`;next.firstChild.textContent=step===2?'Vedi la tua idea ':'Continua ';if(step===3)summary();if(focus){const l=fields[step].querySelector('legend');l.tabIndex=-1;l.focus();}}
 next.addEventListener('click',()=>{for(const el of fields[step].querySelectorAll('input,select'))if(!el.checkValidity()){el.reportValidity();return;}document.getElementById('form-error').textContent='';step=Math.min(3,step+1);render(true);});
 prev.addEventListener('click',()=>{step=Math.max(0,step-1);render(true);});
 restart.addEventListener('click',()=>{form.reset();step=0;render(true);});
 form.addEventListener('submit',e=>{e.preventDefault();if(step<3)next.click();});
 document.getElementById('download-summary').addEventListener('click',()=>{const txt='VICINO VIETNAM\nLa tua idea di viaggio\n\n'+rows().map(([k,v])=>k+': '+v).join('\n')+'\n\nAnteprima: questo riepilogo non è una prenotazione né un preventivo. Nessuna richiesta è stata inviata. Disponibilità e servizi sono da confermare.\n';const url=URL.createObjectURL(new Blob([txt],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='il-mio-viaggio-vietnam.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});render();
}
const floating=document.querySelector('.mobile-cta');
if(floating){const updateBar=()=>{const hero=document.querySelector('.hero');const end=document.querySelector('.closing')||document.querySelector('footer');const show=!form&&!document.querySelector(".discover-catalog,.activity-page,.order-page")&&scrollY>(hero?hero.offsetHeight:200)&&end.getBoundingClientRect().top>innerHeight;floating.classList.toggle('visible',show);};addEventListener('scroll',updateBar,{passive:true});addEventListener('resize',updateBar);updateBar();}
const interestPhotos={natura:['trang-an-landscape-complex-ninh-binh-province','Una barca tra le montagne di Tràng An','Tràng An, Ninh Bình'],villaggi:['hoi-an-ancient-town-2020-01-cn','Case storiche lungo il fiume di Hội An','La vita lungo il fiume, Hội An'],cucina:['cooking-class-hoi-an-32544685208','Preparazione di una ciotola durante una lezione di cucina','In cucina, Hội An'],relax:['lan-ha-bay-jonques','Barche tradizionali nella baia di Lan Hạ','Sull’acqua, baia di Lan Hạ']};
document.querySelectorAll('[data-interest]').forEach(b=>b.addEventListener('click',()=>{const [name,alt,caption]=interestPhotos[b.dataset.interest];const figure=document.querySelector('.personalize figure');const img=figure.querySelector('img');img.srcset=[720,1440,1920].map(w=>`/images/${name}-${w}.webp ${w}w`).join(', ');img.src=`/images/${name}-1440.webp`;img.alt=alt;figure.querySelector('figcaption').textContent=caption;}));
if(form){const duration=new URLSearchParams(location.search).get('durata');const select=form.elements.durata;if([...select.options].some(o=>o.value===duration))select.value=duration;}
const catalogGrid=document.querySelector('.experience-grid');
if(catalogGrid){
 const cards=[...catalogGrid.children],search=document.getElementById('catalog-search'),place=document.getElementById('catalog-place'),sort=document.getElementById('catalog-sort'),buttons=[...document.querySelectorAll('[data-category]')];let category='';
 const normalize=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').toLowerCase();
 function filter(){const query=normalize(search.value.trim());let count=0;cards.sort((a,b)=>sort.value==='az'?a.dataset.title.localeCompare(b.dataset.title,'it'):Number(a.dataset.order)-Number(b.dataset.order));for(const card of cards){const visible=(!place.value||card.dataset.place===place.value)&&(!category||card.dataset.kind===category)&&normalize(card.textContent).includes(query);card.hidden=!visible;if(visible)count++;catalogGrid.append(card);}document.getElementById('catalog-count').textContent=count===1?'1 idea da esplorare':`${count} idee da esplorare`;document.querySelector('.catalog-empty').hidden=count>0;buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.category===category)));}
 function reset(){search.value='';place.value='';category='';sort.value='suggested';filter();}
 search.addEventListener('input',filter);place.addEventListener('change',filter);sort.addEventListener('change',filter);buttons.forEach(b=>b.addEventListener('click',()=>{category=b.dataset.category;filter();}));document.querySelector('.catalog-controls').addEventListener('submit',e=>e.preventDefault());document.getElementById('catalog-reset').addEventListener('click',reset);document.getElementById('catalog-empty-reset').addEventListener('click',()=>{reset();search.focus();});const urlFilters=new URLSearchParams(location.search);search.value=urlFilters.get('q')||'';const desiredPlace=urlFilters.get('destinazione');if([...place.options].some(o=>o.value===desiredPlace))place.value=desiredPlace;document.querySelectorAll('[data-destination]').forEach(a=>a.addEventListener('click',()=>{reset();place.value=a.dataset.destination;filter();}));filter();
}
const photoDialog=document.querySelector('.photo-dialog');
if(photoDialog){const photos=JSON.parse(document.getElementById('photo-data').textContent);let index=0,opener;const large=document.getElementById('photo-large');function show(i){index=(i+photos.length)%photos.length;large.src=photos[index].src;large.alt=photos[index].alt;document.getElementById('photo-status').textContent=`${index+1} / ${photos.length}`;document.getElementById('photo-caption').textContent=photos[index].alt;document.getElementById('photo-prev').disabled=photos.length<2;document.getElementById('photo-next').disabled=photos.length<2;}document.querySelectorAll('[data-photo]').forEach(b=>b.addEventListener('click',()=>{opener=b;show(Number(b.dataset.photo));photoDialog.showModal();document.body.style.overflow='hidden';}));document.getElementById('photo-close').addEventListener('click',()=>photoDialog.close());document.getElementById('photo-prev').addEventListener('click',()=>show(index-1));document.getElementById('photo-next').addEventListener('click',()=>show(index+1));photoDialog.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();show(index+1)}if(e.key==='ArrowLeft'){e.preventDefault();show(index-1)}});photoDialog.addEventListener('close',()=>{document.body.style.overflow='';opener?.focus()});}
if(form){const chosen=new URLSearchParams(location.search).get('esperienza');if(chosen){const note=document.createElement('p');note.className='wizard-selected';note.textContent='La tua ispirazione: '+chosen.slice(0,180);form.prepend(note);}}


// One audible foreground film at a time; background layers are always muted.
const films=[...document.querySelectorAll('.film-main')];
const visibility=new Map(films.map(v=>[v,0]));let activeFilm=null;
const autoplayMuted=new WeakSet();
async function startFilm(v){
 activeFilm=v;films.forEach(other=>{if(other!==v)other.pause();});
 if(v.id==='vietnam-film'&&autoplayMuted.has(v)){v.muted=false;v.volume=1;}
 try{await v.play();autoplayMuted.delete(v);}catch{if(activeFilm!==v||document.hidden)return;autoplayMuted.add(v);v.muted=true;try{await v.play();}catch{}}
 if(activeFilm!==v||document.hidden)v.pause();
}
for(const v of films){
 const screen=v.closest('.film-screen'),bg=screen.querySelector('.film-backdrop'),sound=screen.querySelector('.film-sound');
 v.muted=false;bg.muted=true;
 const align=()=>{if(Math.abs(bg.currentTime-v.currentTime)>.25){try{bg.currentTime=v.currentTime;}catch{}}};
 const soundState=()=>{sound.hidden=!v.muted;};
 v.addEventListener('volumechange',soundState);
 // A direct click is explicit permission to start Welcome with sound.
 if(v.id==='vietnam-film'){
  const playWelcomeWithSound=()=>{
   autoplayMuted.delete(v);v.muted=false;v.volume=1;startFilm(v);
  };
  v.addEventListener('click',()=>{if(v.muted||v.volume===0)playWelcomeWithSound();});
  v.addEventListener('keydown',event=>{
   if((event.key==='Enter'||event.key===' ')&&(v.muted||v.volume===0)){event.preventDefault();playWelcomeWithSound();}
  });
 }

 sound.addEventListener('click',()=>{autoplayMuted.delete(v);v.muted=false;v.volume=1;startFilm(v);});
 v.addEventListener('play',()=>{activeFilm=v;films.forEach(other=>{if(other!==v)other.pause();});align();bg.playbackRate=v.playbackRate;bg.play().catch(()=>{});});
 v.addEventListener('pause',()=>bg.pause());v.addEventListener('ended',()=>bg.pause());
 v.addEventListener('seeking',align);v.addEventListener('timeupdate',align);bg.addEventListener('loadedmetadata',align);
 v.addEventListener('ratechange',()=>{bg.playbackRate=v.playbackRate;});
}
if('IntersectionObserver' in window){
 const choose=()=>{
  if(document.hidden){films.forEach(v=>v.pause());activeFilm=null;return;}
  const candidates=films.filter(v=>visibility.get(v)>=.35&&!v.ended).sort((a,b)=>(visibility.get(b)+(b.id==='vietnam-film'?.05:0))-(visibility.get(a)+(a.id==='vietnam-film'?.05:0)));
  const next=candidates[0];
  if(activeFilm&&candidates.includes(activeFilm)&&visibility.get(activeFilm)>=visibility.get(next)-.1)return;
  if(next){if(activeFilm!==next)startFilm(next);}else{films.forEach(v=>v.pause());activeFilm=null;}
 };
 const observer=new IntersectionObserver(entries=>{for(const e of entries)visibility.set(e.target,e.isIntersecting?e.intersectionRatio:0);choose();},{threshold:[0,.35,.5,.75,1]});
 films.forEach(v=>observer.observe(v));document.addEventListener('visibilitychange',choose);
}
// Recover audible Welcome playback after a real user gesture, only when
// the browser (rather than the visitor) muted autoplay.
function unlockWelcomeSound(event){
 if(!event.isTrusted||event.target.closest?.('.film-screen'))return;
 const welcome=document.getElementById('vietnam-film');
 if(welcome&&autoplayMuted.has(welcome)&&activeFilm===welcome&&!document.hidden){
  welcome.muted=false;welcome.volume=1;
  welcome.play().then(()=>autoplayMuted.delete(welcome)).catch(()=>{welcome.muted=true;});
 }
}
document.addEventListener('click',unlockWelcomeSound);
document.addEventListener('keydown',unlockWelcomeSound);
const filmPlay=document.querySelector('.film-play'),travelFilm=document.getElementById('vietnam-film');
if(filmPlay&&travelFilm){filmPlay.addEventListener('click',()=>{travelFilm.scrollIntoView({behavior:'smooth',block:'center'});startFilm(travelFilm);});travelFilm.addEventListener('play',()=>{filmPlay.disabled=true;filmPlay.textContent='Video in riproduzione';});const reset=()=>{filmPlay.disabled=false;filmPlay.textContent='Guarda il video ▷';};travelFilm.addEventListener('pause',reset);travelFilm.addEventListener('ended',reset);}

// Highlight the current film, keeping the neighboring previews visually quiet.
for(const film of films){
 const card=film.closest('.reel-card');
 const reflectPlayback=()=>card?.classList.toggle('is-playing',!film.paused&&!film.ended);
 film.addEventListener('play',reflectPlayback);film.addEventListener('pause',reflectPlayback);film.addEventListener('ended',reflectPlayback);reflectPlayback();
}

// Stay on the same route and preserve filters/anchors when switching languages.
document.querySelectorAll('[data-language]').forEach(a=>{const target=new URL(a.href);target.search=location.search;target.hash=location.hash;a.href=target.pathname+target.search+target.hash;});
