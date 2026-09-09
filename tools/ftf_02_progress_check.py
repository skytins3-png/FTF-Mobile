#!/usr/bin/env python3
from pathlib import Path
import re,sys
ROOT=Path(__file__).resolve().parents[1]
errors=[]

def read(path):
    p=ROOT/path
    if not p.exists():
        errors.append(f'MISSING: {path}')
        return ''
    return p.read_text(encoding='utf-8')

mapper=read('ftf-cinematic-assets-02.js')
bootstrap=read('ftf-cinematic-assets-01.js')
engine=read('ftf-song-comics.js')
sw=read('sw.js')

for idx in range(11,21):
    rel=f'assets/comics/FTF-02/{idx:02d}.svg'
    data=read(rel)
    if not data: continue
    if len(data)<2500: errors.append(f'FTF-02 scene too small/simple: {rel}')
    if data.count('<path')<3: errors.append(f'FTF-02 scene lacks illustrated environment detail: {rel}')
    if data.count('<circle')<1: errors.append(f'FTF-02 scene lacks illustrated character/environment detail: {rel}')
    for token in ['상황 설명','FTF-02','SCENE']:
        if token not in data: errors.append(f'FTF-02 scene missing {token}: {rel}')
    if not re.search(r'[\u4e00-\u9fff]{2,}',data): errors.append(f'FTF-02 scene lacks Chinese text: {rel}')
    if not re.search(r'[A-Za-z]{3,}',data): errors.append(f'FTF-02 scene lacks English/SFX text: {rel}')
    playback_idx=idx-1
    mapping=f"{playback_idx}:'{idx:02d}.svg'"
    if mapping not in mapper and mapping not in bootstrap:
        errors.append(f'FTF-02 runtime mapping missing playback index {playback_idx} -> {idx:02d}.svg')

for token in ["2:{10:'11.svg'","15:'16.svg'","19:'20.svg'","window.showComic=async function","hasUserComic(n)","?v=50"]:
    if token not in bootstrap: errors.append(f'Active runtime bootstrap missing FTF-02 integration token: {token}')
if 'ftf-cinematic-assets-01.js' not in sw:
    errors.append('Service worker no longer injects the active cinematic bootstrap')
for token in ['const TOTAL=26','ref.currentTime/ref.duration)*TOTAL','finishScene(token)']:
    if token not in engine: errors.append(f'Global playback sync/auto-next contract missing: {token}')

if errors:
    print('FTF-02 progress check FAILED')
    for e in errors: print('ERROR:',e)
    sys.exit(1)
print('PASS: FTF-02 scenes 11-20 are illustrated, multilingual, mapped in the active site runtime, and retain 26-step playback sync plus auto-next behavior.')
