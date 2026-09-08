(()=>{
  const TOTAL=26;
  const SPRITE='./ftf_story_images.jpg';
  const STORY_ASSETS={
    1:{0:'./assets/comics/FTF-01/01.svg',1:'./assets/comics/FTF-01/02.svg'},
    2:{0:'./assets/comics/FTF-02/01.svg',1:'./assets/comics/FTF-02/02.svg'}
  };
  const TRACK_FRAMES={
    1:[0,10,19,16,13,14,1,11,20,17,12,15,2,9,18,23,5,8,3,7,21,22,4,6,24,0],
    2:[21,3,4,7,17,6,22,18,2,24,1,11,23,12,5,20,9,8,15,14,13,16,19,10,0,21],
    3:[5,23,15,20,9,8,24,18,1,11,22,2,12,19,7,6,3,4,21,17,16,14,13,10,0,5],
    4:[22,18,2,24,1,11,23,15,5,20,9,8,12,19,7,6,3,4,21,17,16,14,13,10,0,22],
    5:[12,19,8,20,9,2,14,13,10,0,16,17,21,7,6,3,4,22,18,1,11,23,15,5,24,12],
    6:[24,18,15,1,11,5,23,22,2,20,9,8,12,19,7,6,3,4,21,17,16,14,13,10,0,24],
    7:[23,12,7,6,3,4,21,17,22,18,2,24,1,11,5,20,9,8,15,14,13,16,19,10,0,23],
    8:[10,14,16,19,13,0,12,20,9,8,5,23,15,1,11,24,18,2,22,17,21,7,6,3,4,10]
  };

  const oldShow=window.showComic;
  if(typeof oldShow!=='function')return;

  const viewer=E('viewer'), img=E('comicImg');
  let built=document.getElementById('ftfBuiltImage');
  if(!built){built=document.createElement('div');built.id='ftfBuiltImage';viewer.insertBefore(built,viewer.firstChild)}
  built.style.backgroundRepeat='no-repeat';
  built.style.position='absolute';built.style.inset='0';built.style.zIndex='0';

  function setIntegratedAsset(src){
    built.style.backgroundImage=`url('${src}')`;
    built.style.backgroundSize='cover';
    built.style.backgroundPosition='center center';
    built.style.display='block';img.style.display='none';
  }
  function setSprite(frame){
    frame=((frame%25)+25)%25;
    const col=frame%5,row=Math.floor(frame/5);
    built.style.backgroundImage=`url('${SPRITE}')`;
    built.style.backgroundSize='500% 500%';
    built.style.backgroundPosition=`${col*25}% ${row*25}%`;
    built.style.display='block';img.style.display='none';
  }
  function beatFor(idx){return Math.min(5,Math.floor(idx*6/TOTAL))}
  function customComicAvailable(n){try{return typeof sceneComics==='function'&&sceneComics(n).length>0}catch(e){return false}}
  function integratedAsset(track,idx){return STORY_ASSETS[track]&&STORY_ASSETS[track][idx]}

  window.showComic=async function(n,cut){
    const sc=SCRIPT.find(s=>s.n===n)||SCRIPT[n-1];
    if(!sc)return oldShow(n,cut);
    if(customComicAvailable(n)){built.style.display='none';img.style.display='block';return oldShow(n,cut)}
    const idx=((Number.isFinite(cut)?cut:(window.ftfSceneIndex||0))%TOTAL+TOTAL)%TOTAL;
    window.ftfSceneIndex=idx;
    const beat=beatFor(idx),track=sc.track||n,frames=TRACK_FRAMES[track]||TRACK_FRAMES[1];
    viewer.classList.add('show');
    E('viewerTitle').textContent=sc.name;
    E('viewerStatus').textContent=`대본 ${String(n).padStart(2,'0')} · 만화 ${idx+1}/${TOTAL}`;
    E('sfxText').textContent=(sc.sfx&&sc.sfx[beat])||'';
    E('situation').textContent='상황 설명 · '+((sc.sit&&sc.sit[beat])||'');
    E('captionKo').innerHTML='<span class="langtag">KR</span>'+((sc.ko&&sc.ko[beat])||'');
    E('captionZh').innerHTML='<span class="langtag">中文</span>'+((sc.zh&&sc.zh[beat])||'');
    const asset=integratedAsset(track,idx);
    if(asset)setIntegratedAsset(asset);else setSprite(frames[idx]);
  };

  try{
    window.slideshow=function(n){
      clearInterval(timer);timer=null;currentCut=0;window.ftfSceneIndex=0;showComic(n,0);playSfx(n,0);
    };
  }catch(e){console.warn('FTF slideshow override',e)}

  function bindComicToAudio(n){
    if(!audio)return;
    let last=-1;
    const sync=()=>{
      if(!audio||!Number.isFinite(audio.duration)||audio.duration<=0)return;
      const idx=Math.max(0,Math.min(TOTAL-1,Math.floor((audio.currentTime/audio.duration)*TOTAL)));
      if(idx===last)return;
      last=idx;currentCut=idx;window.ftfSceneIndex=idx;showComic(n,idx);
      if(typeof playSfx==='function')playSfx(n,beatFor(idx));
    };
    audio.addEventListener('loadedmetadata',sync);
    audio.addEventListener('timeupdate',sync);
    audio.addEventListener('seeking',sync);
    sync();
  }

  try{
    const basePlaySong=window.playSong;
    if(typeof basePlaySong==='function'){
      window.playSong=async function(i,done){
        const r=await basePlaySong(i,done);
        if(currentScene>=1&&currentScene<=8)bindComicToAudio(currentScene);
        return r;
      };
    }
  }catch(e){console.warn('FTF audio sync hook',e)}

  try{
    window.playScene=function(n,mode='radio'){
      runToken++;const token=runToken;clearRun();speechSynthesis.cancel();stopAudio();
      currentScene=n;currentCut=0;window.ftfSceneIndex=0;slideshow(n);
      const sc=SCRIPT[n-1],i=sceneSong(n);
      E('now').textContent=`${sc.name} · ${mode==='radio'?'라디오 만화':'영화+음악'}`;
      const finish=()=>{if(token===runToken)finishScene(token)};
      const startMusic=()=>{
        if(token!==runToken)return;
        if(i>=0)playSong(i,finish);
        else sceneEndTimer=setTimeout(finish,TOTAL*4700);
      };
      if(mode==='radio')speakEnglish(sc.en,startMusic); else startMusic();
    };
  }catch(e){console.warn('FTF scene sync override',e)}
})();