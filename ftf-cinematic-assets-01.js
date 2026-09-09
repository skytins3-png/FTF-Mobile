(()=>{
  const BASE='/FTF-Mobile/assets/comics/FTF-01/';
  const EXTRA={10:'11.svg',11:'12.svg',12:'13.svg',13:'14.svg',14:'15.svg',15:'16.svg',16:'17.svg',17:'18.svg',18:'19.svg',19:'20.svg',20:'21.svg'};
  const previous=window.showComic;
  if(typeof previous!=='function')return;
  const E2=id=>document.getElementById(id);
  const hasUserComic=n=>{try{return typeof sceneComics==='function'&&sceneComics(n).length>0}catch(_){return false}};
  window.showComic=async function(n,cut){
    const result=await previous.apply(this,arguments);
    const idx=((Number.isFinite(cut)?cut:(window.ftfSceneIndex||0))%26+26)%26;
    if(n!==1||!EXTRA[idx]||hasUserComic(n))return result;
    const viewer=E2('viewer'),img=E2('comicImg'),built=E2('ftfBuiltImage');
    if(!viewer||!img)return result;
    window.ftfSceneIndex=idx;
    viewer.classList.add('show','ftf-integrated');
    if(built)built.style.display='none';
    img.style.display='block';img.style.objectFit='contain';img.onerror=null;
    ['viewerTitle','viewerStatus','sfxText','situation','captionKo','captionZh'].forEach(id=>{const el=E2(id);if(el)el.textContent=''});
    img.src=BASE+EXTRA[idx]+'?v=48';
    return result;
  };
})();