const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('outputs/sc200-analyst-academy.html','utf8');
const json=JSON.parse(html.match(/<script id="curriculum" type="application\/json">([\s\S]*?)<\/script>/)[1]);
const flashcards=JSON.parse(html.match(/<script id="flashcard-data" type="application\/json">([\s\S]*?)<\/script>/)[1]);
const research=JSON.parse(html.match(/<script id="research-data" type="application\/json">([\s\S]*?)<\/script>/)[1]);
const app=html.match(/<script>\n([\s\S]*?)<\/script>/)[1];
const memory=new Map(),els=new Map();
function element(id){if(!els.has(id))els.set(id,{textContent:id==='curriculum'?JSON.stringify(json):id==='research-data'?JSON.stringify(research):id==='flashcard-data'?JSON.stringify(flashcards):'',innerHTML:'',className:'',dataset:{},addEventListener(){},scrollIntoView(){},setAttribute(){},close(){},showModal(){},classList:{toggle(){},remove(){},add(){}}});return els.get(id);}
const context={document:{addEventListener(){},getElementById:element,querySelectorAll:()=>[],querySelector:()=>null},localStorage:{getItem:k=>memory.get(k),setItem:(k,v)=>memory.set(k,v)},location:{hash:'#home'},window:{addEventListener(){},scrollTo(){}},setTimeout:()=>0,clearTimeout(){},setInterval(){},Date,Math,Object,console,Blob,URL};
vm.createContext(context);vm.runInContext(app,context);
vm.runInContext(`
let checked=0;
for(const q of QUESTIONS){
 if(!isCorrect(q,[...q.answer]))throw Error(q.id+' rejects its correct key');
 if(isCorrect(q,[]))throw Error(q.id+' accepts unanswered');
 if(q.type==='multi'&&isCorrect(q,q.answer.slice(0,-1)))throw Error(q.id+' accepts partial set');
 if(q.type==='order'&&isCorrect(q,[...q.answer].reverse()))throw Error(q.id+' accepts reversed order');
 if(q.type==='single'){const wrong=q.options.map((_,i)=>i).find(i=>!q.answer.includes(i));if(isCorrect(q,[wrong]))throw Error(q.id+' accepts distractor');}
 checked++;
}
for(let i=0;i<100;i++){
 const sample=selectBalanced({manage:21,respond:18,hunt:11});
 if(sample.length!==50||new Set(sample.map(q=>q.id)).size!==50)throw Error('bad sample');
 for(const[d,n]of Object.entries({manage:21,respond:18,hunt:11}))if(sample.filter(q=>q.domain===d).length!==n)throw Error('bad weight');
}
state=blank();
const mq=QMAP['kql-foundations-q2'];record(mq,[0],'diagnostic');if(state.answers[mq.id].correct)throw Error('partial correctness');if(state.answers[mq.id].due>Date.now()+1000)throw Error('incorrect should be due');
record(mq,mq.answer,'diagnostic');if(!state.answers[mq.id].correct||state.answers[mq.id].streak!==1)throw Error('correct record');if(state.answers[mq.id].due<Date.now()+23*3600000)throw Error('review interval');
record(mq,mq.answer,'diagnostic');if(state.answers[mq.id].streak!==2)throw Error('streak');
if(!esc('<script>evil</script>').includes('&lt;script&gt;'))throw Error('escaping');
for(const l of LESSONS){const output=lessonPage(l.id);if(!output.includes('Test this concept'))throw Error('lesson render '+l.id);}
state=blank();start('mock');if(state.session.ids.length!==50)throw Error('mock length');if(state.session.endAt-state.session.started<5999000)throw Error('timer');
const session=state.session;for(const id of session.ids)session.responses[id]=[...QMAP[id].answer];finishSession();if(!state.session.finished||Object.keys(state.answers).length!==50)throw Error('submission recording');
if(!session.ids.every(id=>state.answers[id].correct))throw Error('mock grading');
if(!resultPage(session).includes('100%'))throw Error('result render');
state=blank();start('cases');if(state.session.ids.length!==12)throw Error('case bank');
const cq=QMAP[state.session.ids[0]];state.session.responses[cq.id]=[...cq.answer];state.session.checked[cq.id]=true;finishSession();start('session-missed');if(state.session.ids.length!==11)throw Error('retry must include unanswered');
state=blank();start('mock');state.session.endAt=Date.now()-1;tick();if(!state.session.finished||!state.session.autoSubmitted)throw Error('timer autosubmit');
state=blank();
state.read['sentinel-rbac']=true;
state.answers['kql-foundations-q1']={correct:true,at:Date.now(),due:Date.now(),streak:1,attempts:1};
openFlash('manage');
if(flashData().deck.ids.length!==27)throw Error('manage deck count');
if(!flashCardArea('manage').includes(esc(FCMAP['fc-manage-01'].front)))throw Error('exact front render');
flashRevealed=true;
const back=flashCardArea('manage');
if(!back.includes(fmt(FCMAP['fc-manage-01'].explanation))||!back.includes(fmt(FCMAP['fc-manage-01'].soc)))throw Error('two paragraph render');
flashAdvance(1,'got');
if(flashStats('manage').got!==1||flashData().deck.index!==1)throw Error('rating/advance');
if(!state.read['sentinel-rbac']||!state.answers['kql-foundations-q1'].correct)throw Error('existing study progress altered');
const stored=JSON.parse(localStorage.getItem(KEY));
if(stored.flashcards.ratings['fc-manage-01'].status!=='got')throw Error('ratings persistence');
flashGroup='Configure the Microsoft Sentinel SIEM and platform';flashData().deck=null;
if(flashDeck('manage').ids.length!==4)throw Error('subgroup filter');
flashMode='again';flashData().deck=null;
if(flashDeck('manage').ids.length!==0||!flashCardArea('manage').includes('No cards in this view'))throw Error('combined empty filter');
flashGroup='all';flashMode='all';flashQuery='Windows Event Forwarding';flashData().deck=null;
if(!flashPool('manage').some(c=>c.id==='fc-manage-18'))throw Error('search');
flashQuery='';openFlash('hunt');
if(flashData().deck.ids.length!==10)throw Error('hunt deck count');
flashData().deck.index=9;flashAdvance(1,'again');
if(!flashData().deck.complete||!flashCardArea('hunt').includes('Review session complete'))throw Error('deck completion');
flashAdvance(-1);
if(flashData().deck.complete||flashData().deck.index!==9)throw Error('completion navigation');
for(const domain of ['manage','respond','hunt']){openFlash(domain);for(const id of flashData().deck.ids){flashData().deck.index=flashData().deck.ids.indexOf(id);flashRevealed=false;if(!flashCardArea(domain).includes(esc(FCMAP[id].front)))throw Error('front '+id);flashRevealed=true;const output=flashCardArea(domain);if(!output.includes('SOC workflow & practical examples'))throw Error('back '+id);}}
console.log('PASS: all 54 flashcard fronts/backs, exact category counts, subtopic/status/search filtering, rating persistence, deck completion, and existing study-data preservation.');
console.log('PASS: '+checked+' answer keys, 100 balanced mock samples, exact multi/order grading, review scheduling, 36 lesson renders, 50-question submission, 12-question case workshop, escaping.');
`,context);
assert.equal(json.length,36);assert.equal(json.flatMap(l=>l.questions).length,156);assert(!/<script[^>]+src=/.test(html));assert(!/<link[^>]+href=/.test(html));assert(!/fetch\(/.test(app));console.log('PASS: self-contained HTML has no external runtime dependencies or data requests.');
