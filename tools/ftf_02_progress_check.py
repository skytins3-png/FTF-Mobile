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

for idx in range(11,16):
    rel=f'assets/comics/FTF-02/{idx:02d}.svg'
    data=read(rel)
    if not data: continue
    if len(data)<2500: errors.append(f'FTF-02 scene too small/simple: {rel}')
    if data.count('<path')<4: errors.append(f'FTF-02 scene lacks illustrated environment detail: {rel}')
    if data.count('<circle')<1: errors.append(f'FTF-02 scene lacks illustrated character detail: {rel}')
    for token in ['SITUATION','상황 설명','FTF-02','SCENE']:
        if token not in data: errors.append(f'FTF-02 scene missing {token}: {rel}')
    if not re.search(r'[\u4e00-\u9fff]{2,}',data): errors.append(f'FTF-02 scene lacks Chinese text: {rel}')
    if not re.search(r'[A-Za-z]{3,}',data): errors.append(f'FTF-02 scene lacks English/SFX text: {rel}')
    playback_idx=idx-1
    if f"{playback_idx}:'{idx:02d}.svg'" not in mapper:
        errors.append(f'FTF-02 mapper missing playback index {playback_idx} -> {idx:02d}.svg')

for token in ["n!==2","window.showComic=async function","hasUserComic(n)","?v=50"]:
    if token not in mapper: errors.append(f'FTF-02 mapper missing safety/integration token: {token}')
for token in ['ftf-cinematic-assets-02.js?v=50','data-ftf-cinematic-02']:
    if token not in bootstrap: errors.append(f'FTF-02 mapper is not loaded by active bootstrap: {token}')
if 'ftf-cinematic-assets-01.js' not in sw:
    errors.append('Service worker no longer injects the bootstrap that loads FTF-02 mapper')
for token in ['const TOTAL=26','ref.currentTime/ref.duration)*TOTAL','finishScene(token)']:
    if token not in engine: errors.append(f'Global playback sync/auto-next contract missing: {token}')

if errors:
    print('FTF-02 progress check FAILED')
    for e in errors: print('ERROR:',e)
    sys.exit(1)
print('PASS: FTF-02 scenes 11-15 are illustrated, multilingual, mapped to playback, loaded by the active site bootstrap, and retain 26-step sync/auto-next behavior.')
