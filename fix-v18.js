// FTF v18: robustly link every stored project audio file to its project slot.
(function(){
  function baseTrack(name){
    const t=norm(name);
    const m=(name||'').match(/(?:^|[^a-z0-9])FTF[-_\s]*0?([1-8])(?:[^0-9]|$)/i);
    if(m)return +m[1];
    for(const p of PROJECT_TRACKS){if(p.keys.some(k=>t.includes(norm(k))))return p.no}
    return 0;
  }
  function fallbackMap(){
    const ordered=[...songs].sort((a,b)=>(a.created||0)-(b.created||0)||natural(a.fileName||a.title,b.fileName||b.title));
    const used=new Set();
    ordered.forEach(s=>{const n=baseTrack(s.fileName||s.title);if(n)used.add(n)});
    const missing=PROJECT_TRACKS.map(p=>p.no).filter(n=>!used.has(n));
    const loose=ordered.filter(s=>!baseTrack(s.fileName||s.title));
    const map=new Map();
    loose.forEach((s,i)=>{if(missing[i])map.set(norm(s.fileName||s.title),missing[i])});
    return map;
  }
  trackForSong=function(name){
    const direct=baseTrack(name);if(direct)return direct;
    return fallbackMap().get(norm(name))||0;
  };
  sceneForSong=function(name){const tr=trackForSong(name);return tr>=1&&tr<=7?tr:0};
  render=function(){
    songs.sort(songCmp);
    E('catalogList').innerHTML=PROJECT_TRACKS.map(p=>{let idx=songs.findIndex(s=>trackForSong(s.fileName||s.title)===p.no);return`<div class="catalog"><b>FTF-${String(p.no).padStart(2,'0')} ${p.title}</b><div class="meta">${p.ko}</div><div style="margin-top:5px"><span class="tag ${idx>=0?'ready':'need'}">${idx>=0?'음원 연결됨':'음원 필요'}</span>${idx>=0?`<button onclick="playSong(${idx})" style="padding:5px 8px;font-size:11px">▶ 재생</button>`:''}</div></div>`}).join('');
    E('musicCount').textContent=`현재 실제 보관 음악 ${songs.length}곡`;
    E('comicCount').textContent=`기본 만화 42컷 · 추가 ${comics.length}장`;
    E('scripts').innerHTML=SCRIPT.map(s=>`<div class="script"><span class="sn">대본 ${String(s.n).padStart(2,'0')}</span> · <b>${s.name}</b><div class="meta">상황설명 6 · 특수효과 6 · 만화 6컷</div></div>`).join('');
    E('storyList').innerHTML=SCRIPT.map(s=>{let i=sceneSong(s.n);return`<div class="script"><b>${s.n}. ${s.name}</b><div class="meta">🎵 ${i>=0?(songs[i].title||songs[i].fileName):'연결곡 없음'}<br>🎧 ${s.sfx.join(' · ')}</div><div class="actions"><button onclick="playScene(${s.n},'radio',false)">▶ 라디오 만화</button></div></div>`}).join('');
    E('songList').innerHTML=songs.map(s=>{let tr=trackForSong(s.fileName||s.title);return`<div class="song"><b>${tr?`FTF-${String(tr).padStart(2,'0')} · `:'보관곡 · '}${s.title||s.fileName}</b><div class="meta">${s.fileName||''}</div></div>`}).join('')||'<div class="note">실제 음원을 추가해 주세요.</div>';
  };
  render();
})();