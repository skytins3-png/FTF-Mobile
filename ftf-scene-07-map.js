(()=>{
  window.ftfComicTargetScenes=30;
  const prior=window.showComic;
  if(typeof prior!=='function')return;
  const assets={6:'/FTF-Mobile/assets/comics/FTF-03/07.svg?v=174',7:'/FTF-Mobile/assets/comics/FTF-03/08.svg?v=174'};
  window.showComic=async function(n,cut){
    const result=await prior.apply(this,arguments);
    const requested=Number.isFinite(cut)?Math.max(0,Math.floor(cut)):(window.ftfSceneIndex||0);
    if(n!==3||!assets[requested])return result;
    try{if(typeof sceneComics==='function'&&sceneComics(3).length>0)return result}catch(_){ }
    const viewer=document.getElementById('viewer'),img=document.getElementById('comicImg'),built=document.getElementById('ftfBuiltImage');
    if(!viewer||!img)return result;
    window.ftfSceneIndex=requested;viewer.classList.add('show','ftf-integrated');if(built)built.style.display='none';
    img.style.display='block';img.style.objectFit='contain';img.onerror=null;
    ['viewerTitle','viewerStatus','sfxText','situation','captionKo','captionZh'].forEach(id=>{const el=document.getElementById(id);if(el)el.textContent=''});
    img.src=assets[requested];return result;
  };
})();