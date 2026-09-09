(()=>{
  const BASE='/FTF-Mobile/assets/comics/';
  const COMPLETE=new Set([2,8]);
  const previous=window.showComic;
  if(typeof previous!=='function')return;
  const q=id=>document.getElementById(id);
  const hasUserComic=n=>{try{return typeof sceneComics==='function'&&sceneComics(n).length>0}catch(_){return false}};
  window.showComic=async function(n,cut){
    const result=await previous.apply(this,arguments);
    if(!COMPLETE.has(n)||hasUserComic(n))return result;
    const idx=((Number.isFinite(cut)?cut:(window.ftfSceneIndex||0))%26+26)%26;
    const viewer=q('viewer'),img=q('comicImg'),built=q('ftfBuiltImage');
    if(!viewer||!img)return result;
    const src=`${BASE}FTF-${String(n).padStart(2,'0')}/${String(idx+1).padStart(2,'0')}.svg?v=51`;
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