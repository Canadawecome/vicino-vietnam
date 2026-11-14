import fs from 'node:fs';
const library=JSON.parse(fs.readFileSync(new URL('./library.json',import.meta.url),'utf8'));
export const experiences=[...library,
 ['Tràng An, tra acqua e montagne','Ninh Bình','Natura','hero','Una barca tra le montagne di Tràng An','Lascia spazio al paesaggio: un’idea per chi ama l’acqua, il verde e la fotografia.','/it/esperienze-locali/#natura','Esplora questa idea'],
 ['Tam Cốc, al ritmo del fiume','Ninh Bình','Natura','tamcoc','Una barca sul fiume di Tam Cốc','Paesaggi da osservare lentamente, con Ninh Bình come base per qualche giorno.','/it/viaggio-vietnam-autentico/','Scopri l’itinerario'],
 ['Duck Stop: segui le anatre','Hội An','Vita locale','ducks','Una visitatrice con un’anatra al Duck Stop di Hội An','Un incontro nella campagna di Hội An, tra anatre e vita di fattoria.','https://www.klook.com/en-US/activity/217006-duck-stop-eco-farm-duck-leader-experience-in-hoi-an/','Vedi su Klook ↗'],
 ['Hội An, un posto a tavola','Hội An','Cucina','food','Preparazione di una ciotola in una cucina di Hội An','Sapori e gesti quotidiani come punto di partenza per conoscere un luogo.','/it/esperienze-locali/#vita-locale','Esplora questa idea'],
 ['Lan Hạ, un altro orizzonte','Lan Hạ','Natura','bay','Barche tradizionali nella baia di Lan Hạ','Acqua verde e montagne calcaree: un’ispirazione per la tappa nella baia.','/it/viaggio-vietnam-autentico/','Scopri l’itinerario'],
 ['Hội An, quando scende la sera','Hội An','Con calma','night','Lanterne e riflessi sul fiume a Hội An','Le luci sul fiume e il tempo per una passeggiata senza aggiungere altre tappe.','/it/esperienze-locali/#vita-locale','Esplora questa idea'],
 ['Mù Cang Chải, paesaggi di riso','Mù Cang Chải','Natura','terraces','Risaie terrazzate di Mù Cang Chải','Un’idea fotografica per il Nord, da progettare secondo stagione e trasferimenti.','/it/crea-il-tuo-viaggio/?interesse=natura','Crea il tuo viaggio'],
 ['In cucina, a Hội An','Hội An','Cucina','cooking','Mani al lavoro durante una lezione di cucina a Hội An','Un’esperienza pratica da valutare con chi ospita, secondo le disponibilità.','/it/crea-il-tuo-viaggio/?interesse=cucina','Crea il tuo viaggio']
];
export const detailSlug=(x)=>'esperienze/'+(x[3].startsWith('klook-')?x[3].slice(6):x[3]);
