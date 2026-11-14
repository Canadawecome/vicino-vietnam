import {destinations,mapActivities} from './map-data.js';
export function distanceKm(a,b){const rad=x=>x*Math.PI/180,dlat=rad(b.lat-a.lat),dlon=rad(b.lon-a.lon);const v=Math.sin(dlat/2)**2+Math.cos(rad(a.lat))*Math.cos(rad(b.lat))*Math.sin(dlon/2)**2;return 6371*2*Math.atan2(Math.sqrt(v),Math.sqrt(1-v));}
export function nearbyIdeas(ids,{avoid=[],taste=[]}={}){
 const selected=new Set(ids),anchors=destinations.filter(d=>d.activities.some(a=>selected.has(a.id)&&!a.avoid.some(v=>avoid.includes(v))));if(!anchors.length)return [];
 const interests=new Set([...taste,...mapActivities.filter(a=>selected.has(a.id)).flatMap(a=>a.taste)]);
 const candidates=mapActivities.filter(a=>a.local&&!selected.has(a.id)&&!a.avoid.some(v=>avoid.includes(v))).map(a=>{const place=destinations.find(d=>d.id===a.destination);const options=anchors.filter(d=>d.region===place.region).map(d=>({anchor:d,km:distanceKm(d,place)})).sort((a,b)=>a.km-b.km);if(!options.length)return null;const {anchor,km}=options[0];if(km>120)return null;const same=anchor.id===place.id,shared=a.taste.filter(v=>interests.has(v)).length;return {...a,anchor:anchor.name,km,same,shared,score:(same?1000:0)+shared*15-km};}).filter(Boolean).sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id));
 const count=new Map(),result=[];for(const a of candidates){if((count.get(a.destination)||0)>=2)continue;result.push(a);count.set(a.destination,(count.get(a.destination)||0)+1);if(result.length===4)break;}return result;
}
