(()=>{
  const norm=s=>(s||'').toLowerCase().normalize('NFKC').replace(/\.[a-z0-9]{2,5}$/i,'').replace(/[’'`]/g,'').replace(/[^0-9a-z가-힣一-龥]+/g,' ').replace(/\s+/g,' ').trim();
  const label=s=>s.fileName||s.title||'';
  const ALIASES={
    1:['ftf 01','earth warning','earths warning','지구의 경고','지구 경고'],
    2:['ftf 02','september 13','typhoon arka','arka','태풍 아르카','9월 13'],
    3:['ftf 03','earth survival plan','survival plan','지구 생존','생존 계획','제1차'],
    4:['ftf 04','five year plan','5 year plan','5년 계획','제2차'],
    5:['ftf 05','youth first love','first love','청춘의 일상','청춘','첫사랑'],
    6:['ftf 06','project 0714','0714','비밀 관찰'],
    7:['ftf 07','third earth future council','future council','제3차','지구미래 대책회의'],
    8:['ftf 08','for the future set sail','set sail','출항','미래를 위하여 출항']
  };
  function explicit(name){const t=norm(name);let m=t.match(/(?:^|\s)ftf\s*0?([1-8])(?:\s|$)/);return m?+m[1]:0}
  function matchTrack(name){const ex=explicit(name);if(ex)return ex;const t=norm(name);for(let n=1;n<=8;n++)if(ALIASES[n].some(a=>t.includes(norm(a))))return n;return 0}
  function strictMap(){const map=new Map();songs.forEach((s,i)=>{const n=matchTrack(label(s));if(n&&!map.has(n))map.set(n,i)});return map}
  window.FTFAutoTrackMap=strictMap;
  window.FTFTrackForSong=matchTrack;
  try{
    trackForSong=matchTrack;
    sceneForSong=name=>{const n=matchTrack(name);return n>=1&&n<=8?n:0};
    sceneSong=n=>strictMap().get(n)??-1;
  }catch(e){console.warn('FTF strict mapping',e)}
  function renderStrict(){try{
    const map=strictMap();
    const cat=E('catalogList');if(cat)cat.innerHTML=PROJECT_TRACKS.map(p=>{const idx=map.get(p.no)??-1;return `<div class="catalog"><b>FTF-${String(p.no).padStart(2,'0')} ${p.title}</b><div class="meta">${p.ko}</div><div style="margin-top:5px"><span class="tag ${idx>=0?'ready':'need'}">${idx>=0?'연결됨':'파일명 확인 필요'}</span>${idx>=0?`<button onclick="playSong(${idx})" style="padding:5px 8px;font-size:11px">▶ 재생</button>`:''}</div></div>`}).join('');
    const sc=E('storyList');if(sc)sc.innerHTML=SCRIPT.map(s=>{const i=map.get(s.n)??-1;return `<div class="script"><b>${s.n}. ${s.name}</b><div class="meta">🎵 ${i>=0?(songs[i].title||songs[i].fileName):'연결곡 없음'}<br>🎧 ${s.sfx.join(' · ')}</div><div class="actions"><button onclick="playScene(${s.n},'radio',false)">▶ 라디오 만화</button></div></div>`}).join('');
    const mc=E('musicCount');if(mc)mc.textContent=`보관 음악 ${songs.length}곡 · FTF 순서 고정 01→08`;
  }catch(e){console.warn(e)}}
  try{const oldRender=render;render=function(){oldRender();renderStrict()}}catch(e){}
  renderStrict();

  // A rapid scene/song change can leave an older IndexedDB audio load resolving late.
  // Use a monotonic request token so only the newest request is allowed to create/play Audio.
  try{
    let audioRequestToken=0;
    const safeStop=()=>{audioRequestToken++;stopAudio()};
    const originalStopAudio=stopAudio;
    stopAudio=function(){audioRequestToken++;originalStopAudio()};
    playSong=async function(i,done){
      const token=++audioRequestToken;
      originalStopAudio();
      if(i<0||i>=songs.length){if(token===audioRequestToken&&done)done();return}
      let f;
      try{f=await dbGet(ADB,AST,songs[i].id)}catch(_){f=null}
      if(token!==audioRequestToken)return;
      if(!f){done&&done();return}
      const localUrl=URL.createObjectURL(f);
      if(token!==audioRequestToken){URL.revokeObjectURL(localUrl);return}
      aurl=localUrl;
      audio=new Audio(aurl);
      let ended=false;
      const finish=()=>{
        if(ended||token!==audioRequestToken)return;
        ended=true;
        done&&done();
      };
      audio.onended=finish;
      audio.onerror=finish;
      try{
        await audio.play();
        if(token!==audioRequestToken){try{audio.pause()}catch(_){};return}
        current=i;
        E('pause').textContent='⏸ 일시정지';
      }catch(_){finish()}
    };
    window.FTFStopAudioNow=safeStop;
  }catch(e){console.warn('FTF audio overlap guard',e)}
})();