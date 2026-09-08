#!/usr/bin/env python3
from pathlib import Path
import json,re,sys

ROOT=Path(__file__).resolve().parents[1]
errors=[]; warnings=[]

def need(path):
    p=ROOT/path
    if not p.exists(): errors.append(f'MISSING: {path}')
    return p

def text(path):
    p=need(path)
    return p.read_text(encoding='utf-8') if p.exists() else ''

index=text('index.html')
manifest_text=text('manifest.webmanifest')
sw=text('sw.js')
comics=text('ftf-song-comics.js')
viewer=text('ftf-viewer-polish.js')
cinema=text('ftf-cinematic-ui.js')
audio=text('ftf-auto-audio.js')
fix=text('ftf-comic-fix.js')

core=['ftf-images.js','ftf-radio-comic.js','ftf-auto-audio.js','ftf-comic-fix.js','ftf-song-comics.js','ftf-viewer-polish.js','ftf-cinematic-ui.js','ftf_story_images.jpg','icon-192.png','icon-512.png']
for f in core: need(f)

for n in range(1,9):
    if f'no:{n}' not in index and f'n:{n}' not in index:
        errors.append(f'Project track/scene {n} not found in index.html')
    if f'{n}:' not in comics:
        errors.append(f'Comic mapping missing FTF-{n:02d}')
    if f'{n}:' not in audio:
        errors.append(f'Audio alias mapping missing FTF-{n:02d}')

try:
    manifest=json.loads(manifest_text)
    if manifest.get('id')!='/FTF-Mobile/': errors.append('manifest id must be /FTF-Mobile/')
    if manifest.get('scope')!='/FTF-Mobile/': errors.append('manifest scope must be /FTF-Mobile/')
    if not str(manifest.get('start_url','')).startswith('/FTF-Mobile/'): errors.append('manifest start_url must stay under /FTF-Mobile/')
except Exception as e:
    errors.append(f'manifest JSON invalid: {e}')

if 'const TOTAL=26' not in comics: errors.append('ftf-song-comics.js TOTAL must be 26')
if 'ref.currentTime/ref.duration)*TOTAL' not in comics: errors.append('audio-to-comic synchronization missing')
if 'finishScene(token)' not in comics: errors.append('automatic next-scene/song continuation missing')

for token in ["viewer.classList.toggle('ftf-integrated'",'integratedMode(true)',"E('situation').textContent=''","E('sfxText').textContent=''","E('captionKo').textContent=''","E('captionZh').textContent=''"]:
    if token not in comics and token not in viewer:
        errors.append(f'Integrated comic overlay guard missing: {token}')
if '.viewer.ftf-integrated .situation' not in viewer or '.viewer.ftf-integrated .subtitleWrap' not in viewer:
    errors.append('viewer polish must hide duplicate situation/subtitle UI')

for token in ['ftfCinemaCounter','ftfProgressFill','ftfPrev','ftfPlay','ftfNext','/ 26']:
    if token not in cinema: errors.append(f'Cinematic mobile player missing: {token}')
if 'ftf-cinematic-ui.js' not in sw: errors.append('service worker must inject/cache cinematic UI')

mapped=set(re.findall(r"assets/comics/FTF-\d{2}/\d{2}\.svg", comics))
cached=set(re.findall(r"assets/comics/FTF-\d{2}/\d{2}\.svg", sw))
for rel in sorted(mapped):
    if not (ROOT/rel).exists(): errors.append(f'Mapped comic asset missing: {rel}')
    if rel not in cached: errors.append(f'Mapped comic asset not cached: {rel}')

for p in ROOT.rglob('*'):
    if p.is_file() and p.suffix.lower() in {'.js','.json','.html','.css','.svg','.py','.yml','.yaml','.txt'}:
        try: data=p.read_text(encoding='utf-8')
        except Exception: continue
        if data.strip()=='PLACEHOLDER': errors.append(f'Forbidden placeholder file: {p.relative_to(ROOT)}')

counts={}
for n in range(1,9):
    d=ROOT/f'assets/comics/FTF-{n:02d}'
    count=len(list(d.glob('*.svg'))) if d.exists() else 0
    counts[n]=count
    if count<26: warnings.append(f'FTF-{n:02d}: {count}/26 illustrated files currently present')

if '.situation{' in fix and '!important' in fix:
    warnings.append('legacy overlay CSS remains; integrated mode must stay active for repository comics')

print('FTF integrity check')
print('Mapped comic files:',len(mapped))
print('Scene file counts:',', '.join(f'FTF-{n:02d}={c}/26' for n,c in counts.items()))
for w in warnings: print('WARN:',w)
if errors:
    for e in errors: print('ERROR:',e)
    sys.exit(1)
print('PASS: project data, PWA path, mappings, sync, auto-next, cinematic UI, cache references and overlay guards are consistent.')
