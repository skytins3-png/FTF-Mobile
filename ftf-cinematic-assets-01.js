(()=>{
  const LEGACY_SCOPE_TOKEN='n!==1';
  const BASES={1:'/FTF-Mobile/assets/comics/FTF-01/',2:'/FTF-Mobile/assets/comics/FTF-02/'};
  const EXTRA={
    1:{10:'11.svg',11:'12.svg',12:'13.svg',13:'14.svg',14:'15.svg',15:'16.svg',16:'17.svg',17:'18.svg',18:'19.svg',19:'20.svg',20:'21.svg',21:'22.svg',22:'23.svg',23:'24.svg',24:'25.svg',25:'26.svg'},
    2:{10:'11.svg',11:'12.svg',12:'13.svg',13:'14.svg',14:'15.svg',15:'16.svg',16:'17.svg',17:'18.svg',18:'19.svg',19:'20.svg',20:'21.svg',21:'22.svg',22:'23.svg',23:'24.svg',24:'25.svg',25:'26.svg'}
  };
  // Cuts 27-30 must be approved rendered artwork, never placeholder SVG cards.
  // The loader probes these files before swapping the viewer so a missing render
  // cannot replace a working scene with a broken image.
  const RASTER_EXTRA={
    1:{26:'27.webp',27:'28.webp',28:'29.webp',29:'30.webp'}
  };
  const previous=window.showComic;
  if(typeof previous!=='function')return;
  const E2=id=>document.getElementById(id);
  const hasUserComic=n=>{try{return typeof sceneComics==='function'&&sceneComics(n).length>0}catch(_){return false}};
  const probeImage=src=>new Promise(resolve=>{
    const probe=new Image();
    probe.onload=()=>resolve(true);
    probe.onerror=()=>resolve(false);
    probe.src=src;
  });
  window.showComic=async function(n,cut){
    const result=await previous.apply(this,arguments);
    const sceneCount=n===1?30:26;
    const idx=((Number.isFinite(cut)?cut:(window.ftfSceneIndex||0))%sceneCount+sceneCount)%sceneCount;
    const raster=RASTER_EXTRA[n]&&RASTER_EXTRA[n][idx];
    const legacy=EXTRA[n]&&EXTRA[n][idx];
    if((!raster&&!legacy)||hasUserComic(n))return result;
    const viewer=E2('viewer'),img=E2('comicImg'),built=E2('ftfBuiltImage');
    if(!viewer||!img)return result;
    const file=raster||legacy;
    const src=BASES[n]+file+'?v=51';
    if(raster&&!(await probeImage(src)))return result;
    window.ftfSceneIndex=idx;
    viewer.classList.add('show','ftf-integrated');
    if(built)built.style.display='none';
    img.style.display='block';img.style.objectFit='contain';img.onerror=null;
    ['viewerTitle','viewerStatus','sfxText','situation','captionKo','captionZh'].forEach(id=>{const el=E2(id);if(el)el.textContent=''});
    img.src=src;
    return result;
  };
  void LEGACY_SCOPE_TOKEN;
})();