(()=>{
  // Full-track playback guard: scene changes must wait for the real audio end.
  // This patch is loaded last by the service worker so later UI/comic scripts cannot
  // re-introduce the old fixed scene timeout that cut songs short.
  let playbackRun=0;

  const cancelSpeech=()=>{try{speechSynthesis.cancel()}catch(_){}};
  const stopEverything=()=>{
    playbackRun++;
    try{runToken++}catch(_){ }
    try{autoMode=null}catch(_){ }
    try{clearRun()}catch(_){ }
    cancelSpeech();
    try{stopAudio()}catch(_){ }
  };

  function safeSceneSong(n){
    try{return typeof sceneSong==='function'?sceneSong(n):-1}catch(_){return -1}
  }

  window.playScene=function(n,mode='radio'){
    const localRun=++playbackRun;
    try{runToken++}catch(_){ }
    const token=typeof runToken==='number'?runToken:localRun;

    try{clearRun()}catch(_){ }
    cancelSpeech();
    try{stopAudio()}catch(_){ }

    try{currentScene=n;currentCut=0;window.ftfSceneIndex=0}catch(_){ }
    try{slideshow(n)}catch(_){ }

    const sc=(typeof SCRIPT!=='undefined'&&(SCRIPT.find?.(s=>s.n===n)||SCRIPT[n-1]))||null;
    if(!sc)return;
    const i=safeSceneSong(n);
    const now=document.getElementById('now');
    if(now)now.textContent=`${sc.name} · ${mode==='radio'?'라디오 만화':'영화+음악'} · 전곡 재생`;

    let finished=false;
    const finish=()=>{
      if(finished||localRun!==playbackRun)return;
      finished=true;
      try{finishScene(token)}catch(_){ }
    };

    const startMusic=()=>{
      if(localRun!==playbackRun)return;
      cancelSpeech();
      // Remove any legacy fixed-duration fallback before the track starts.
      try{clearTimeout(sceneEndTimer);sceneEndTimer=null}catch(_){ }
      try{stopAudio()}catch(_){ }
      if(i>=0){
        try{
          playSong(i,finish);
        }catch(_){finish()}
      }else{
        if(now)now.textContent=`${sc.name} · 연결곡 없음`;
        try{sceneEndTimer=setTimeout(finish,6000)}catch(_){setTimeout(finish,6000)}
      }
    };

    if(mode==='radio'&&sc.en){
      try{speakEnglish(sc.en,startMusic)}catch(_){startMusic()}
    }else startMusic();
  };

  window.startAuto=function(mode='movie'){
    playbackRun++;
    cancelSpeech();
    try{stopAudio()}catch(_){ }
    try{clearRun()}catch(_){ }
    try{autoMode=mode;queuePos=0;currentScene=1}catch(_){ }
    playScene(1,mode);
  };

  // Existing stop button must cancel a pending narration/audio callback too.
  const stopBtn=document.getElementById('stopAll');
  if(stopBtn)stopBtn.onclick=stopEverything;

  // Manual previous/next remains single-track playback, but cancel auto sequencing first
  // so two songs can never overlap.
  const prev=document.getElementById('prev'),next=document.getElementById('next');
  if(prev)prev.onclick=()=>{
    playbackRun++;
    try{autoMode=null}catch(_){ }
    cancelSpeech();
    try{clearRun()}catch(_){ }
    try{playSong(Math.max(0,current-1))}catch(_){ }
  };
  if(next)next.onclick=()=>{
    playbackRun++;
    try{autoMode=null}catch(_){ }
    cancelSpeech();
    try{clearRun()}catch(_){ }
    try{playSong(Math.min(songs.length-1,current+1))}catch(_){ }
  };

  window.FTFFullTrackPlayback={version:1,stop:stopEverything};
})();
