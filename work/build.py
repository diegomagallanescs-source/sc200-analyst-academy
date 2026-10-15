import json,pathlib,collections
root=pathlib.Path('work/content')
ls=sum([json.loads((root/f'{x}.json').read_text()) for x in ['manage','respond','hunt']],[])
ids=set();qids=set()
for l in ls:
 assert l['id'] not in ids,l['id'];ids.add(l['id'])
 assert len(l['questions'])>=4
 for q in l['questions']:
  assert q['id'] not in qids,q['id'];qids.add(q['id'])
  assert len(q['options'])==len(q['explanations']),q['id']
  assert q['answer'] and all(0<=i<len(q['options']) for i in q['answer']),q['id']
  assert q['type'] in ['single','multi','order'],q['id']
  assert len(set(q['answer']))==len(q['answer'])
  if q['type']=='order':assert set(q['answer'])==set(range(len(q['options']))),q['id']
  if q['type']=='single':assert len(q['answer'])==1,q['id']
  if q['type']=='multi':assert len(q['answer'])>=2,q['id']
fcfiles=['flashcards-manage-a.json','flashcards-manage-b.json','flashcards-respond.json','flashcards-hunt.json']
flashcards=sum([json.loads((root/f).read_text()) for f in fcfiles],[])
objectives=json.loads((root/'flashcard-objectives.json').read_text())
assert len(flashcards)==54
assert [(c['id'],c['domain'],c['group'],c['front']) for c in flashcards]==[(c['id'],c['domain'],c['group'],c['front']) for c in objectives], 'Objective text or order mismatch'
assert len({c['id'] for c in flashcards})==54
for c in flashcards:
 assert c['explanation'] and c['soc'] and '\n\n' not in c['explanation'] and '\n\n' not in c['soc']
 assert len(c['sources'])>=2
 assert all(id in ids for id in c['lessons'])
(root/'flashcards.json').write_text(json.dumps(flashcards,ensure_ascii=False,indent=2))
research=json.loads(pathlib.Path('work/research/research.json').read_text());research['reddit'][-1]['url']='https://www.reddit.com/r/AZURE/comments/1lgsuzg/'
html=pathlib.Path('work/app.html').read_text().replace('__CURRICULUM__',json.dumps(ls,ensure_ascii=False).replace('</','<\\/')).replace('__FLASHCARDS__',json.dumps(flashcards,ensure_ascii=False).replace('</','<\\/')).replace('__RESEARCH__',json.dumps(research,ensure_ascii=False).replace('</','<\\/'))
assert '__CURRICULUM__' not in html
pathlib.Path('outputs/sc200-analyst-academy.html').write_text(html)
pathlib.Path('work/content/all.json').write_text(json.dumps(ls,ensure_ascii=False,indent=2))
print('LESSONS',len(ls),'QUESTIONS',len(qids),'TYPES',dict(collections.Counter(q['type'] for l in ls for q in l['questions'])))
print('CASE QUESTIONS',sum(bool(q.get('context')) for l in ls for q in l['questions']))
print('LESSON SOURCES',len({s['url'] for l in ls for s in l['sources']}))
print('FLASHCARDS',len(flashcards),dict(collections.Counter(c['domain'] for c in flashcards)))
print('HTML bytes',len(html.encode()))
