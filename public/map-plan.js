import {orderDestinations} from './route-order.js';
import {mapActivities,destinations} from './map-data.js';
export function applyMapPlan(plan,raw){
 const ids=Array.isArray(raw.mapSelections)?[...new Set(raw.mapSelections)].filter(id=>mapActivities.some(a=>a.id===id)).slice(0,80):[];
 plan.preferences.mapSelections=ids;plan.preferences.locale=raw.locale==='en'?'en':'it';
 if(!ids.length)return plan;
 const en=raw.locale==='en',i=en?1:0,t=(it,english)=>en?english:it,p=plan.preferences;
 const selected=mapActivities.filter(a=>ids.includes(a.id));
 const excluded=selected.filter(a=>a.avoid.some(x=>p.avoid.includes(x)));
 const usable=selected.filter(a=>!excluded.includes(a));
 const route=orderDestinations(destinations.filter(d=>usable.some(a=>a.destination===d.id)),raw.routeOrder);
 plan.preferences.routeOrder=route.map(d=>d.id);
 const queue=[];let previous=null;
 for(const d of route){
  if(previous)queue.push({kind:'transfer',stops:[previous.id,d.id],title:t('Trasferimento: ','Travel: ')+previous.name+' → '+d.name,place:d.name,description:t('Giornata riservata al cambio di base. Mezzo, durata e fattibilità da confermare: non è una connessione verificata.','A day reserved for changing base. Transport, duration and feasibility need confirmation; this is not a verified connection.'),why:t('Lo spazio tra due luoghi fa parte del viaggio.','Time between destinations is part of the journey.'),url:null});
  for(const a of usable.filter(a=>a.destination===d.id)){queue.push({id:a.id,kind:'experience',stops:[d.id],title:a.title[i],place:d.name,description:a.description[i],why:t('Scelta da te sulla mappa. Modalità e disponibilità da concordare.','Chosen by you on the map. Arrangements and availability to confirm.'),url:a.detail?(en?'/en/':'/it/')+'esperienze/'+a.detail+'/':(en?'/en/':'/it/')+'il-tuo-vietnam/?attivita='+encodeURIComponent(a.id)});if(p.pace==='slow')queue.push({kind:'rest',stops:[d.id],title:t('Una pausa, al tuo ritmo','A pause, at your own pace'),place:d.name,description:t('Tempo libero per riposare e vivere il luogo senza aggiungere attività.','Free time to rest and enjoy the place without adding activities.'),why:t('Hai scelto un ritmo tranquillo.','You chose a slower pace.'),url:null});}
  previous=d;
 }
 const first=route[0]?.name||t('Da definire','To be decided');
 const arrival={kind:'arrival',stops:route[0]?[route[0].id]:[],title:t('Arrivo e ambientamento','Arrival and settling in'),place:first,description:t('Concorda il trasferimento verso la prima base e lascia tempo al riposo.','Arrange transport to your first base and allow time to rest.'),why:t('Un inizio senza fretta.','An unhurried start.'),url:null};
 const scheduled=queue.slice(0,p.days-2),last=scheduled.at(-1)?.place||first;
 const lastStop=scheduled.at(-1)?.stops?.at(-1)||route[0]?.id;
 while(scheduled.length<p.days-2)scheduled.push({kind:'free',stops:lastStop?[lastStop]:[],title:t('Tempo libero','Free time'),place:last,description:t('Un margine da lasciare libero o definire con un referente.','Keep some breathing room or discuss ideas with an adviser.'),why:t('Non ogni ora deve essere programmata.','Not every hour needs a plan.'),url:null});
 const pending=usable.filter(a=>!scheduled.some(d=>d.id===a.id));
 plan.days=[arrival,...scheduled,{kind:'departure',stops:lastStop?[lastStop]:[],title:t('Partenza, con margine','Departure, with time to spare'),place:last,description:t('Il rientro va verificato rispetto all’ultimo luogo e al volo. Potrebbero servire altri giorni di trasferimento.','Check your return against the last destination and your flight. Additional travel days may be needed.'),why:t('Da confermare prima di prenotare.','Confirm before booking.'),url:null}];
 plan.base=route.map(d=>d.name).join(' → ')||first;
 plan.title=t('Il viaggio che hai scelto','The journey you chose');
 plan.summary=t('Le tue scelte diventano una prima traccia: attività, pause e cambi di base restano da concordare.','Your choices become a first outline: activities, pauses and changes of base still need agreement.');
 plan.values[0]={title:t('I tuoi luoghi, il tuo percorso','Your places, your route'),text:plan.base};
 plan.values[2]={title:t('Nessun desiderio perso','No wish forgotten'),text:t('Le attività non inserite restano nella lista da discutere, senza sostituzioni automatiche.','Activities that do not fit stay on your discussion list, without automatic substitutions.')};
 plan.mapSelections=selected.map(a=>({id:a.id,title:a.title[i],place:a.place,status:excluded.includes(a)?'excluded':pending.includes(a)?'pending':'planned'}));
 plan.warnings=[t('Traccia indicativa, nell’ordine delle tappe scelto. Trasferimenti, durata delle visite e alternative della stessa attività devono essere verificati.','Indicative outline in your chosen stop order. Transfers, visit durations and alternatives within the same activity must be checked.'),...plan.warnings];
 if(pending.length)plan.warnings.unshift(t('Da tenere in riserva (non nel programma): ','Keep in reserve (not in the schedule): ')+pending.map(a=>a.title[i]).join('; '));
 if(excluded.length)plan.warnings.unshift(t('Non inserite perché incompatibili con le esclusioni: ','Not scheduled because they conflict with exclusions: ')+excluded.map(a=>a.title[i]).join('; '));
 return plan;
}
