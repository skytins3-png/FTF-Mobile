(()=>{
  window.ftfComicTargetScenes=30;
  const prior=window.showComic;
  if(typeof prior!=='function')return;
  window.showComic=async function(n,cut){
    const result=await prior.apply(this,arguments);
    const requested=Number.isFinite(cut)?Math.max(0,Math.floor(cut)):(window.ftfSceneIndex||0);
    if(n!==3||requested!==6)return result;
    try{if(typeof sceneComics==='function'&&sceneComics(3).length>0)return result}catch(_){ }
    const viewer=document.getElementById('viewer');
    const img=document.getElementById('comicImg');
    const built=document.getElementById('ftfBuiltImage');
    if(!viewer||!img)return result;
    window.ftfSceneIndex=6;
    viewer.classList.add('show','ftf-integrated');
    if(built)built.style.display='none';
    img.style.display='block';
    img.style.objectFit='contain';
    img.onerror=null;
    ['viewerTitle','viewerStatus','sfxText','situation','captionKo','captionZh'].forEach(id=>{const el=document.getElementById(id);if(el)el.textContent=''});
    img.src='/FTF-Mobile/assets/comics/FTF-03/07.svg?v=173';
    return result;
  };
})();