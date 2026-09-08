(()=>{
  const TOTAL=26;
  const SPRITE='./ftf_story_images.jpg';
  const TRACK_FRAMES={
    1:[0,10,19,16,13,14,0,10,19,16,13,14,0,10,19,16,13,14,0,10,19,16,13,14,0,10],
    2:[21,3,4,7,17,6,21,3,4,7,17,6,21,3,4,7,17,6,21,3,4,7,17,6,21,3],
    3:[5,23,15,20,9,8,5,23,15,20,9,8,5,23,15,20,9,8,5,23,15,20,9,8,5,23],
    4:[22,18,2,24,1,11,22,18,2,24,1,11,22,18,2,24,1,11,22,18,2,24,1,11,22,18],
    5:[12,19,8,20,9,2,12,19,8,20,9,2,12,19,8,20,9,2,12,19,8,20,9,2,12,19],
    6:[24,18,15,1,11,5,24,18,15,1,11,5,24,18,15,1,11,5,24,18,15,1,11,5,24,18],
    7:[23,12,7,6,3,4,23,12,7,6,3,4,23,12,7,6,3,4,23,12,7,6,3,4,23,12],
    8:[10,14,16,19,13,0,10,14,16,19,13,0,10,14,16,19,13,0,10,14,16,19,13,0,10,14]
  };

  const oldShow=window.showComic;
  if(typeof oldShow!=='function')return;

  const viewer=E('viewer'), img=E('comicImg');
  let built=document.getElementById('ftfBuiltImage');
  if(!built){
    built=document.createElement('div');
    built.id='ftfBuiltImage';
    viewer.insertBefore(built,viewer.firstChild);
  }
  built.style.backgroundImage=`url('${SPRITE}')`;
  built.style.backgroundRepeat='no-repeat';
  built.style.backgroundSize='500% 500%';
  built.style.position='absolute';
  built.style.inset='0';
  built.style.zIndex='0';

  function setSprite(frame){
    frame=((frame%25)+25)%25;
    const col=frame%5,row=Math.floor(frame/5);
    built.style.backgroundPosition=`${col*25}% ${row*25}%`;
    built.style.display='block';
    img.style.display='none';
  }

  function storyBeat(sceneIndex){
    return Math.min(5,Math.floor(sceneIndex*6/TOTAL));
  }

  function customComicAvailable(n){
    try{return typeof sceneComics==='function'&&sceneComics(n).length>0}catch(e){return false}
  }

  window.showComic=async function(n,cut){
    const sc=SCRIPT.find(s=>s.n===n)||SCRIPT[n-1];
    if(!sc)return oldShow(n,cut);

    if(customComicAvailable(n)){
      built.style.display='none';
      img.style.display='block';
      return oldShow(n,cut);
    }

    const idx=((Number.isFinite(cut)?cut:(window.ftfSceneIndex||0))%TOTAL+TOTAL)%TOTAL;
    window.ftfSceneIndex=(idx+1)%TOTAL;
    const beat=storyBeat(idx);
    const track=sc.track||n;
    const frames=TRACK_FRAMES[track]||TRACK_FRAMES[1];

    viewer.classList.add('show');
    E('viewerTitle').textContent=sc.name;
    E('viewerStatus').textContent=`대본 ${String(n).padStart(2,'0')} · 만화 ${idx+1}/${TOTAL}`;
    E('sfxText').textContent=(sc.sfx&&sc.sfx[beat])||'';
    E('situation').textContent='상황 설명 · '+((sc.sit&&sc.sit[beat])||'');
    E('captionKo').innerHTML='<span class="langtag">KR</span>'+((sc.ko&&sc.ko[beat])||'');
    E('captionZh').innerHTML='<span class="langtag">中文</span>'+((sc.zh&&sc.zh[beat])||'');
    setSprite(frames[idx]);
  };

  if(typeof window.playScene==='function'){
    const oldPlayScene=window.playScene;
    window.playScene=function(n,mode){
      window.ftfSceneIndex=0;
      return oldPlayScene.apply(this,arguments);
    };
  }
})();