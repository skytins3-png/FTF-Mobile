(()=>{
  const BASE='/FTF-Mobile/assets/comics/';
  // Production target is 180 distinct scenes per song.
  const TARGET_SCENES=180;
  // Only advertise assets that actually exist in the repository.
  const AVAILABLE_SCENES={1:103,2:26,8:26};
  const COMPLETE=new Set(Object.keys(AVAILABLE_SCENES).map(Number));
  const previous=window.showComic;
  if(typeof previous!=='function')return;
  const q=id=>document.getElementById(id);
  const hasUserComic=n=>{try{return typeof sceneComics==='function'&&sceneComics(n).length>0}catch(_){return false}};
  window.ftfComicTargetScenes=TARGET_SCENES;
  window.showComic=async function(n,cut){
    const result=await previous.apply(this,arguments);
    if(!COMPLETE.has(n)||hasUserComic(n))return result;
    const available=AVAILABLE_SCENES[n]||0;
    const requested=Number.isFinite(cut)?Math.max(0,Math.floor(cut)):(window.ftfSceneIndex||0);
    // Never wrap or fall back to an unrelated panel beyond the real asset count.
    if(requested>=available||requested>=TARGET_SCENES)return result;
    const idx=requested;
    const viewer=q('viewer'),img=q('comicImg'),built=q('ftfBuiltImage');
    if(!viewer||!img)return result;
    const sceneNumber=idx+1;
    // Raster cinematic panels: 77, 96, 102. Scene 91 is raster artwork embedded in SVG; all other mapped scenes are vector scenes.
    const ext=(n===1&&(sceneNumber===77||sceneNumber===96||sceneNumber===102))?'jpg':'svg';
    const src=`${BASE}FTF-${String(n).padStart(2,'0')}/${String(sceneNumber).padStart(2,'0')}.${ext}?v=127`;
    window.ftfSceneIndex=idx;
    viewer.classList.add('show','ftf-integrated');
    if(built)built.style.display='none';
    img.style.display='block';
    img.style.objectFit='contain';
    img.onerror=null;
    ['viewerTitle','viewerStatus','sfxText','situation','captionKo','captionZh'].forEach(id=>{const el=q(id);if(el)el.textContent=''});
    img.src=src;
    return result;
  };
})();