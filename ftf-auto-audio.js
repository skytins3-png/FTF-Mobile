(()=>{
  const normAuto=s=>(s||'').toLowerCase().normalize('NFKC').replace(/\.[a-z0-9]{2,5}$/i,'').replace(/[’'`]/g,'').replace(/[^0-9a-z가-힣一-龥]+/g,' ').replace(/\s+/g,' ').trim();
  const fileLabel=s=>s.fileName||s.title||'';
  function explicitTrack(name){
    const t=normAuto(name);
    let m=t.match(/(?:^|\s)ftf\s*0?([1-8])(?:\s|$)/i); if(m)return +m[1];
    m=t.match(/(?:^|\s)0?([1-8])\s+(?:earth|september|typhoon|five|youth|project|third|for|지구|태풍|청춘|미래)/i); return m?+m[1]:0;
  }
  function strongTrack(name){
    const ex=explicitTrack(name); if(ex)return ex;
    const t=normAuto(name);
    const aliases={
      1:['earth warning','earths warning','지구의 경고','지구 경고'],
      2:['september 13','typhoon arka','arka','태풍 아르카','9월 13'],
      3:['earth survival plan','survival plan','지구 생존','생존 계획','제1차'],
      4:['five year plan','fiveyear plan','5 year plan','5년 계획','제2차'],
      5:['youth first love','first love','youth','청춘','첫사랑'],
      6:['project 0714','0714','비밀 관찰'],
      7:['third earth future council','future council','third council','제3차','지구미래 대책회의'],
      8:['for the future set sail','set sail','출항','미래를 위하여 출항']
    };
    for(const [no,arr] of Object.entries(aliases)) if(arr.some(a=>t.includes(normAuto(a)))) return +no;
    return 0;
  }
  function autoMap(){
    const map=new Map(), used=new Set();
    songs.forEach((s,i)=>{const n=strongTrack(fileLabel(s)); if(n&&!map.has(n)){map.set(n,i);used.add(i)}});
    const missing=[]; for(let n=1;n<=8;n++)if(!map.has(n))missing.push(n);
    const remaining=songs.map((s,i)=>({s,i})).filter(x=>!used.has(x.i));
    remaining.sort((a,b)=>{
      const ea=explicitTrack(fileLabel(a.s))||99, eb=explicitTrack(fileLabel(b.s))||99;
      if(ea!==eb)return ea-eb;
      return (a.s.created||0)-(b.s.created||0)||fileLabel(a.s).localeCompare(fileLabel(b.s),'ko',{numeric:true});
    });
    missing.forEach((n,k)=>{if(remaining[k])map.set(n,remaining[k].i)});
    return map;
  }
  window.FTFAutoTrackMap=autoMap;
  try{
    trackForSong=function(name){
      const strong=strongTrack(name); if(strong)return strong;
      const idx=songs.findIndex(s=>fileLabel(s)===name || s.fileName===name || s.title===name);
      if(idx<0)return 0;
      for(const [n,i] of autoMap())if(i===idx)return n;
      return 0;
    };
    sceneForSong=function(name){const n=trackForSong(name);return n>=1&&n<=8?n:0};
    sceneSong=function(n){return autoMap().get(n)??-1};
  }catch(e){console.warn('FTF auto mapping override',e)}

  async function recoverAudio(){
    try{
      const d=await dbOpen(ADB,AST);
      const tx=d.transaction(AST,'readonly'), st=tx.objectStore(AST);
      const [keys,vals]=await Promise.all([
        new Promise(ok=>{const r=st.getAllKeys();r.onsuccess=()=>ok(r.result||[]);r.onerror=()=>ok([])}),
        new Promise(ok=>{const r=st.getAll();r.onsuccess=()=>ok(r.result||[]);r.onerror=()=>ok([])})
      ]);
      d.close();
      const byId=new Set(songs.map(s=>String(s.id)));
      let changed=false;
      vals.forEach((f,i)=>{
        const id=String(keys[i]); if(byId.has(id))return;
        const name=(f&&f.name)||`FTF-AUDIO-${i+1}`;
        songs.push({id,title:name.replace(/\.[^.]+$/,''),fileName:name,created:Date.now()+i,recovered:true});
        byId.add(id); changed=true;
      });
      if(changed)localStorage.setItem(KEY,JSON.stringify(songs));
      renderAuto();
    }catch(e){console.warn('FTF audio recovery',e);renderAuto()}
  }
  function renderAuto(){
    try{
      songs.sort(songCmp);
      const map=autoMap();
      const cat=E('catalogList');
      if(cat)cat.innerHTML=PROJECT_TRACKS.map(p=>{
        const idx=map.has(p.no)?map.get(p.no):-1;
        return `<div class="catalog"><b>FTF-${String(p.no).padStart(2,'0')} ${p.title}</b><div class="meta">${p.ko}</div><div style="margin-top:5px"><span class="tag ${idx>=0?'ready':'need'}">${idx>=0?'자동 연결됨':'자동 검색 중'}</span>${idx>=0?`<button onclick="playSong(${idx})" style="padding:5px 8px;font-size:11px">▶ 재생</button>`:''}</div></div>`
      }).join('');
      const mc=E('musicCount'); if(mc)mc.textContent=`자동 확인된 음악 ${songs.length}곡 · 제목이 달라도 자동 연결`;
      const sc=E('storyList'); if(sc)sc.innerHTML=SCRIPT.map(s=>{const i=map.get(s.n)??-1;return `<div class="script"><b>${s.n}. ${s.name}</b><div class="meta">🎵 ${i>=0?(songs[i].title||songs[i].fileName):'자동 검색 중'}<br>🎧 ${s.sfx.join(' · ')}</div><div class="actions"><button onclick="playScene(${s.n},'radio',false)">▶ 라디오 만화</button></div></div>`}).join('');
      const sl=E('songList'); if(sl)sl.innerHTML=songs.map((s,i)=>{let tr=0;for(const [n,x] of map)if(x===i){tr=n;break}return `<div class="song"><b>${tr?`FTF-${String(tr).padStart(2,'0')} · `:'보관곡 · '}${s.title||s.fileName}</b><div class="meta">${s.fileName||''}${s.recovered?' · 자동 복구':''}</div></div>`}).join('')||'<div class="note">음원을 자동 검색하고 있습니다.</div>';
    }catch(e){console.warn('FTF auto render',e)}
  }
  try{render=renderAuto}catch(e){}
  recoverAudio();
})();