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
    p=need(path); return p.read_text(encoding='utf-8') if p.exists() else ''
index=text('index.html'); manifest_text=text('manifest.webmanifest'); sw=text('sw.js')
comics=text('ftf-song-comics.js'); viewer=text('ftf-viewer-polish.js'); cinema=text('ftf-cinematic-ui.js')
assets08=text('ftf-cinematic-assets-08.js'); assets12=text('ftf-cinematic-assets-01.js'); audio=text('ftf-auto-audio.js'); fix=text('ftf-comic-fix.js')
for f in ['ftf-images.js','ftf-radio-comic.js','ftf-auto-audio.js','ftf-comic-fix.js','ftf-song-comics.js','ftf-viewer-polish.js','ftf-cinematic-ui.js','ftf-cinematic-scenes-08.js','ftf-cinematic-assets-08.js','ftf-cinematic-assets-01.js','ftf_story_images.jpg','icon-192.png','icon-512.png']:
    need(f)
for n in range(1,9):
    if f'no:{n}' not in index and f'n:{n}' not in index: errors.append(f'Project track/scene {n} missing from index.html')
    if f'{n}:' not in comics: errors.append(f'Comic mapping missing FTF-{n:02d}')
    if f'{n}:' not in audio: errors.append(f'Audio alias mapping missing FTF-{n:02d}')
try:
    manifest=json.loads(manifest_text)
    if manifest.get('id')!='/FTF-Mobile/' or manifest.get('scope')!='/FTF-Mobile/': errors.append('manifest scope/id changed')
    if 'v50' not in str(manifest.get('start_url','')): errors.append('manifest must expose v50 build')
except Exception as e: errors.append(f'manifest JSON invalid: {e}')
if 'ftf-mobile-v50' not in sw: errors.append('service worker cache must be v50')
for token in ['const TOTAL=26','ref.currentTime/ref.duration)*TOTAL','finishScene(token)']:
    if token not in comics: errors.append(f'Playback contract missing: {token}')
for token in ['ftfCinemaCounter','ftfProgressFill','ftfPrev','ftfPlay','ftfNext','/ 26']:
    if token not in cinema: errors.append(f'Cinematic mobile player missing: {token}')
for token in ['ftf-cinematic-ui.js','ftf-cinematic-assets-08.js','ftf-cinematic-assets-01.js']:
    if token not in sw: errors.append(f'service worker missing runtime asset: {token}')
# FTF-01, FTF-02 and FTF-08 are complete 26-scene sequences and must remain fully cached.
for track,mapper in [(1,assets12),(2,assets12),(8,assets08)]:
    for idx in range(1,27):
        rel=f'assets/comics/FTF-{track:02d}/{idx:02d}.svg'; p=ROOT/rel
        if not p.exists(): errors.append(f'Complete sequence asset missing: {rel}'); continue
        if rel not in sw: errors.append(f'Complete sequence asset not cached: {rel}')
        if idx>=11 and track in (1,2) and f"'{idx:02d}.svg'" not in mapper: errors.append(f'Playback mapper missing FTF-{track:02d}/{idx:02d}.svg')
        if idx>=5 and track==8 and f"'{idx:02d}.svg'" not in mapper: errors.append(f'Playback mapper missing FTF-08/{idx:02d}.svg')
        if track==2 and idx>=21:
            data=p.read_text(encoding='utf-8')
            for token in ['<path','상황 설명','FTF-02']:
                if token not in data: errors.append(f'FTF-02 scene {idx:02d} lacks {token}')
            if not re.search(r'[\u4e00-\u9fff]{2,}',data): errors.append(f'FTF-02 scene {idx:02d} lacks Chinese text')
            if not re.search(r'[A-Za-z]{3,}',data): errors.append(f'FTF-02 scene {idx:02d} lacks English text/SFX')
            if len(data)<2500: errors.append(f'FTF-02 scene {idx:02d} too simple to count as finished illustration')
if "2:{10:'11.svg'" not in assets12 or "25:'26.svg'" not in assets12: errors.append('FTF-02 mapper must cover scene 11 through final scene 26')
if "window.showComic=async function" not in assets12: errors.append('FTF-01/02 mapper must wrap showComic')
for token in ["viewer.classList.toggle('ftf-integrated'",'integratedMode(true)']:
    if token not in comics and token not in viewer: errors.append(f'Integrated comic guard missing: {token}')
for p in ROOT.rglob('*'):
    if p.is_file() and p.suffix.lower() in {'.js','.json','.html','.css','.svg','.py','.yml','.yaml','.txt'}:
        try: data=p.read_text(encoding='utf-8')
        except Exception: continue
        if data.strip()=='PLACEHOLDER': errors.append(f'Forbidden placeholder file: {p.relative_to(ROOT)}')
counts={}
for n in range(1,9):
    d=ROOT/f'assets/comics/FTF-{n:02d}'; c=len(list(d.glob('*.svg'))) if d.exists() else 0; counts[n]=c
    if c<26: warnings.append(f'FTF-{n:02d}: {c}/26 illustrated files currently present')
for n in (1,2,8):
    if counts.get(n,0)<26: errors.append(f'FTF-{n:02d} must retain a complete 26-scene sequence')
if '.situation{' in fix and '!important' in fix: warnings.append('legacy overlay CSS remains; integrated mode must stay active')
print('FTF integrity check')
print('Scene file counts:',', '.join(f'FTF-{n:02d}={c}/26' for n,c in counts.items()))
for w in warnings: print('WARN:',w)
if errors:
    for e in errors: print('ERROR:',e)
    sys.exit(1)
print('PASS: project data, PWA v50, 26-scene sync/auto-next, mobile cinematic UI, and complete FTF-01/02/08 sequences are consistent.')
