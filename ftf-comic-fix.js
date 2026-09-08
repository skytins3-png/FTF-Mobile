(()=>{
const css=document.createElement('style');
css.textContent=`#ftfBuiltImage{display:none!important}#comicImg{display:block!important;object-fit:cover!important;filter:none!important}.situation{left:4%!important;right:18%!important;bottom:22%!important;background:#fff7df!important;color:#111!important;border:4px solid #111!important;border-radius:8px!important;padding:12px 14px!important;font-weight:900!important;text-shadow:none!important;box-shadow:6px 6px 0 #0008!important}.subtitleWrap{left:3%!important;right:3%!important;bottom:3%!important;justify-content:flex-end!important}.subtitle{position:relative!important;width:min(78%,760px)!important;background:#fff!important;color:#111!important;border:4px solid #111!important;border-radius:28px!important;padding:14px 18px!important;box-shadow:7px 7px 0 #0008!important;text-align:left!important}.subtitle:after{content:'';position:absolute;right:28px;bottom:-30px;border:18px solid transparent;border-top-color:#111}.subtitle:before{content:'';position:absolute;right:31px;bottom:-22px;border:14px solid transparent;border-top-color:#fff;z-index:2}.ko{font-size:clamp(18px,4.6vw,28px)!important;line-height:1.32!important;font-weight:1000!important}.zh{font-size:clamp(14px,3.7vw,21px)!important;line-height:1.3!important;margin-top:7px!important}.sfx{top:19%!important;right:5%!important;z-index:5!important}.vstatus{background:#000d!important}`;
document.head.appendChild(css);
const originalShow=showComic;
showComic=async function(n,cut){
  const scene=SCRIPT[n-1],ci=((cut%6)+6)%6;
  const built=document.getElementById('ftfBuiltImage');if(built)built.style.display='none';
  E('comicImg').style.display='block';
  await originalShow(n,cut);
  if(built)built.style.display='none';
  E('comicImg').style.display='block';
  E('viewerStatus').textContent=`대본 ${String(n).padStart(2,'0')} · 만화 컷 ${ci+1}/6`;
  E('situation').textContent='상황 설명 · '+scene.sit[ci];
  E('captionKo').innerHTML='<span class="langtag">KR</span>'+scene.ko[ci];
  E('captionZh').innerHTML='<span class="langtag">中文</span>'+scene.zh[ci];
};
})();