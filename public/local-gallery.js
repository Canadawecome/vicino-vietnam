import {localPhotos} from './local-gallery-data.js';
import {localDetails} from './local-details.js';
export function createLocalGallery({lang,selected,incompatible,toggle}){
 const t=(it,en)=>lang?en:it;
 const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text)n.textContent=text;if(cls)n.className=cls;return n;};
 const dialog=el('dialog',null,'local-gallery');dialog.setAttribute('aria-labelledby','local-detail-title');
 const close=el('button','×','local-gallery-close');close.type='button';close.setAttribute('aria-label',t('Chiudi dettagli','Close details'));
 const layout=el('div',null,'local-gallery-layout'),media=el('section',null,'local-gallery-media'),copy=el('section',null,'local-gallery-copy');
 const stage=el('div',null,'local-gallery-stage'),image=el('img'),prev=el('button','←','gallery-prev'),next=el('button','→','gallery-next'),count=el('span',null,'gallery-count');
 prev.type=next.type='button';prev.setAttribute('aria-label',t('Foto precedente','Previous photo'));next.setAttribute('aria-label',t('Foto successiva','Next photo'));stage.append(image,prev,next,count);
 const thumbs=el('div',null,'gallery-thumbs'),caption=el('p',null,'gallery-caption'),credit=el('p',null,'gallery-credit');caption.setAttribute('aria-live','polite');
 media.append(stage,thumbs,caption,credit);layout.append(media,copy);dialog.append(close,layout);document.body.append(dialog);
 let activity,index=0,trigger,oldOverflow;
 function renderPhoto(){const ids=activity.gallery,p=localPhotos[ids[index]];image.src=p.src;image.alt=p.caption[lang];caption.textContent=p.caption[lang];count.textContent=`${index+1} / ${ids.length}`;prev.hidden=next.hidden=ids.length<2;
  thumbs.replaceChildren();thumbs.hidden=ids.length<2;ids.forEach((id,i)=>{const photo=localPhotos[id],b=el('button'),im=el('img');b.type='button';b.setAttribute('aria-label',t('Vedi foto ','View photo ')+(i+1));b.setAttribute('aria-pressed',String(i===index));im.src=photo.thumb;im.alt='';im.width=84;im.height=64;b.append(im);b.onclick=()=>{index=i;renderPhoto();thumbs.children[i].focus({preventScroll:true});};thumbs.append(b);});
  credit.replaceChildren();const source=el('a',p.author+' ↗');source.href=p.source;source.target='_blank';source.rel='noopener';credit.append(source,document.createTextNode(' · '+p.license));if(p.licenseUrl){const license=el('a',t(' Licenza',' License'));license.href=p.licenseUrl;license.target='_blank';license.rel='noopener';credit.append(license);}
 }
 function change(step){index=(index+step+activity.gallery.length)%activity.gallery.length;renderPhoto();}
 prev.onclick=()=>change(-1);next.onclick=()=>change(1);close.onclick=()=>dialog.close();
 dialog.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();change(1);}if(e.key==='ArrowLeft'){e.preventDefault();change(-1);}});
 dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
 dialog.addEventListener('close',()=>{document.body.style.overflow=oldOverflow;const returnTo=trigger?.isConnected?trigger:(document.querySelector('.atlas-nearby-open #nearby-title')||document.querySelector(`[data-detail="${activity.id}"]`));returnTo?.focus({preventScroll:true});});
 return function open(a,eventTrigger){activity=a;index=0;trigger=eventTrigger;const detail=a.editorial||localDetails[a.destination];copy.replaceChildren();const location=el('p',a.place+' · '+t('INCONTRI LOCALI','LOCAL ENCOUNTERS'),'map-eyebrow'),title=el('h2',a.title[lang]);title.id='local-detail-title';copy.append(location,title,el('p',a.description[lang],'local-detail-lead'),el('h3',detail[0][lang]),el('p',detail[1][lang]));
 const heading=el('h3',t('Come potrebbe svolgersi','How it could unfold')),steps=el('ol',null,'local-detail-steps');detail[2][lang].split(';').forEach(s=>steps.append(el('li',s)));copy.append(heading,steps,el('h3',t('Da concordare con chi ti accoglie','Agree with your host')),el('p',t('Durata e luogo d’incontro · lingua di supporto · partecipazione pratica · stagione · esigenze alimentari · prezzo e materiali. È un’idea da personalizzare, non un servizio già prenotabile.','Duration and meeting point · language support · hands-on participation · season · dietary needs · price and materials. This is an idea to personalise, not a service already available to book.'),'local-detail-note'));
 const source=el('a',t('Leggi il contesto della proposta ↗','Read the proposal’s source context ↗'),'local-detail-source');source.href=a.source;source.target='_blank';source.rel='noopener';copy.append(source);
 const footer=el('div',null,'local-detail-footer'),add=el('button',null,'button'),status=el('p');add.type='button';status.setAttribute('aria-live','polite');function state(){add.textContent=selected.has(a.id)?t('Rimuovi dal mio viaggio −','Remove from my trip −'):t('Aggiungi al mio viaggio +','Add to my trip +');add.setAttribute('aria-pressed',String(selected.has(a.id)));add.disabled=incompatible(a)&&!selected.has(a.id);if(add.disabled)add.textContent=t('Esclusa dalle tue preferenze','Excluded by your preferences');}state();add.onclick=()=>{toggle(a);state();status.textContent=selected.has(a.id)?t('Aggiunta alla tua lista.','Added to your wishlist.'):t('Rimossa dalla tua lista.','Removed from your wishlist.');};footer.append(add,status);copy.append(footer);renderPhoto();oldOverflow=document.body.style.overflow;document.body.style.overflow='hidden';dialog.showModal();dialog.scrollTop=0;close.focus();
 };
}
