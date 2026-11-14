import assert from 'node:assert/strict';
import fs from 'node:fs';
import {destinations,mapActivities} from './public/map-data.js';
import {makePlan} from './public/order-engine.js';
assert.equal(destinations.length,16);assert.equal(mapActivities.length,80);
for(const d of destinations){assert.equal(d.activities.length,5);for(const a of d.activities){if(a.image)assert(fs.existsSync('public'+a.image),a.image);if(a.detail)assert(fs.existsSync('dist/it/esperienze/'+a.detail+'/index.html'),a.detail);else assert(a.source?.startsWith('https://')); }}
let p=makePlan({mapSelections:['hoian-1','hoian-2','hoian-3','bad'],avoid:['boats','animals'],locale:'en',days:5});
assert.deepEqual(p.preferences.mapSelections,['hoian-1','hoian-2','hoian-3']);assert.equal(p.mapSelections.filter(a=>a.status==='excluded').length,2);assert(p.days.some(d=>d.id==='hoian-3'));assert(!p.days.some(d=>['hoian-1','hoian-2'].includes(d.id)));assert.equal(p.days.length,5);assert.equal(p.title,'The journey you chose');
p=makePlan({mapSelections:['sapa-1','hanoi-1','hoian-3','phuquoc-local-1'],days:3});assert.equal(p.mapSelections.length,4);assert(p.mapSelections.some(a=>a.status==='pending'));assert.equal(p.days.length,3);assert.equal(p.days.filter(d=>d.id).length,1);
p=makePlan({mapSelections:['hanoi-1','hoian-3'],days:10,pace:'active'});assert.equal(p.days.filter(d=>d.id).length,2);assert(p.days.some(d=>d.title.includes('Trasferimento')));assert.equal(p.preferences.mapSelections.length,2);
assert.equal(makePlan({mapSelections:'bad'}).preferences.mapSelections.length,0);
console.log('PASS: 16 destinations, 80 activities, all images/details, exclusions, pending choices, transfers, locale and input validation.');
