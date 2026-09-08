(()=>{
  const BASE='/FTF-Mobile/assets/comics/FTF-08/';
  const EXTRA={4:'05.svg',5:'06.svg',6:'07.svg',7:'08.svg',8:'09.svg',9:'10.svg',10:'11.svg',11:'12.svg',12:'13.svg',13:'14.svg'};
  const previous=window.showComic;
  if(typeof previous!=='function')return;
  const E2=id=>document.getElementById(id);
  const hasUserComic=n=>{try{return typeof sceneComics==='function'&&sceneComics(n).length>0}catch(_){return false}};
  window.showComic=async function(n,cut){
    const result=await previous.apply(this,arguments);
    const idx=((Number.isFinite(cut)?cut:(window.ftfSceneIndex||0))%26+26)%26;
    if(n!==8||!EXTRA[idx]||hasUserComic(n))return result;
    const viewer=E2('viewer'),img=E2('comicImg'),built=E2('ftfBuiltImage');
    if(!viewer||!img)return result;
    window.ftfSceneIndex=idx;
    viewer.classList.add('show','ftf-integrated');
    if(built)built.style.display='none';
    img.style.display='block';img.style.objectFit='contain';img.onerror=null;
    ['viewerTitle','viewerStatus','sfxText','situation','captionKo','captionZh'].forEach(id=>{const el=E2(id);if(el)el.textContent=''});
    img.src=BASE+EXTRA[idx]+'?v=42';
    return result;
  };
})();