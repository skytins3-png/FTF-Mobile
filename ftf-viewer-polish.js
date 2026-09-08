(()=>{
  const viewer=document.getElementById('viewer');
  const img=document.getElementById('comicImg');
  if(!viewer||!img)return;

  const style=document.createElement('style');
  style.id='ftfViewerPolishStyle';
  style.textContent=`
    .viewer.ftf-integrated .vshade,
    .viewer.ftf-integrated .vtitle,
    .viewer.ftf-integrated .vstatus,
    .viewer.ftf-integrated .sfx,
    .viewer.ftf-integrated .situation,
    .viewer.ftf-integrated .subtitleWrap{display:none!important}
    .viewer.ftf-integrated #comicImg{
      display:block!important;
      position:absolute!important;
      inset:0!important;
      width:100%!important;
      height:100%!important;
      object-fit:cover!important;
      background:#000!important;
    }
    .viewer.ftf-integrated .vtop{
      left:auto!important;
      right:10px!important;
      top:10px!important;
      width:auto!important;
      padding:0!important;
      pointer-events:none!important;
    }
    .viewer.ftf-integrated #closeViewer{
      display:block!important;
      pointer-events:auto!important;
      width:58px!important;
      height:58px!important;
      border-radius:18px!important;
      padding:0!important;
      font-size:28px!important;
      background:#111827dd!important;
      border:1px solid #ffffff22!important;
      color:#fff!important;
    }
  `;
  document.head.appendChild(style);

  const sync=()=>{
    const src=img.currentSrc||img.src||'';
    const integrated=img.style.display!=='none' && src.includes('/FTF-Mobile/assets/comics/');
    viewer.classList.toggle('ftf-integrated',integrated);
  };

  const observer=new MutationObserver(sync);
  observer.observe(img,{attributes:true,attributeFilter:['src','style','class']});
  observer.observe(viewer,{attributes:true,attributeFilter:['class']});
  img.addEventListener('load',sync);
  img.addEventListener('error',()=>viewer.classList.remove('ftf-integrated'));
  sync();
})();