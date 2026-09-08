(()=>{
const PANELS=26,PANEL_MS=4700;
const css=document.createElement('style');
css.textContent=`#ftfBuiltImage{display:none!important}#comicImg{display:block!important;object-fit:cover!important;filter:none!important}.situation{left:4%!important;right:4%!important;top:16%!important;bottom:auto!important;background:#fff7df!important;color:#111!important;border:4px solid #111!important;border-radius:8px!important;padding:10px 12px!important;font-weight:900!important;text-shadow:none!important;box-shadow:6px 6px 0 #0008!important;max-height:20vh!important;overflow:hidden!important}.subtitleWrap{display:none!important}.sfx{top:34%!important;right:5%!important;z-index:8!important}.vstatus{background:#000d!important}.ftfBubble{z-index:9!important;max-width:78%!important;bottom:5%!important}.viewer img{background:#111}.ftfPanelProgress{position:absolute;left:14px;top:98px;z-index:10;background:#000c;border:1px solid #ffffff55;border-radius:999px;padding:6px 10px;font-size:11px;color:#fff}`;
document.head.appendChild(css);
const viewer=E('viewer');
let prog=E('ftfPanelProgress');if(!prog){prog=document.createElement('div');prog.id='ftfPanelProgress';prog.className='ftfPanelProgress';viewer.appendChild(prog)}
function beatForPanel(panel){return Math.min(5,Math.floor((((panel%PANELS)+PANELS)%PANELS)*6/PANELS))}
function panelNo(name){
  const s=(name||'').replace(/\.[^.]+$/,'');
  let m=s.match(/(?:panel|cut|컷)[-_\s]*0?(\d{1,2})(?:\D|$)/i);if(m)return Math.min(PANELS,Math.max(1,+m[1]));
  m=s.match(/(?:ftf|scene|s)[-_\s]*0?\d{1,2}[-_\s]+0?(\d{1,2})(?:\D|$)/i);return m?Math.min(PANELS,Math.max(1,+m[1])):0;
}
function orderedSceneComics(n){return sceneComics(n).slice().sort((a,b)=>{const pa=panelNo(a.name)||999,pb=panelNo(b.name)||999;return pa-pb||natural(a.name,b.name)})}
async function setPanelImage(n,panel,beat){
  const list=orderedSceneComics(n);let c=null;
  if(list.length){c=list.find(x=>panelNo(x.name)===panel+1)||list[panel%list.length]}
  if(c){const f=await dbGet(CDB,CST,c.id);if(f){if(objUrl)URL.revokeObjectURL(objUrl);objUrl=URL.createObjectURL(f);E('comicImg').src=objUrl;return}}
  E('comicImg').src=comicSvg(n,beat);
}
showComic=async function(n,panel){
  const sc=SCRIPT[n-1]||SCRIPT.find(s=>s.n===n);if(!sc)return;
  const p=((panel%PANELS)+PANELS)%PANELS,beat=beatForPanel(p);
  const built=document.getElementById('ftfBuiltImage');if(built)built.style.display='none';
  E('comicImg').style.display='block';E('viewer').classList.add('show');
  E('viewerTitle').textContent=sc.name;
  E('viewerStatus').textContent=`대본 ${String(n).padStart(2,'0')} · 만화 ${p+1}/${PANELS}`;
  prog.textContent=`장면 ${p+1} / ${PANELS}`;
  E('sfxText').textContent=sc.sfx[beat]||'';
  E('situation').textContent='상황 설명 · '+(sc.sit[beat]||'');
  E('captionKo').innerHTML='<span class="langtag">KR</span>'+(sc.ko[beat]||'');
  E('captionZh').innerHTML='<span class="langtag">中文</span>'+(sc.zh[beat]||'');
  await setPanelImage(n,p,beat);
};
slideshow=function(n){clearInterval(timer);currentCut=0;showComic(n,0);playSfx(n,0);timer=setInterval(()=>{currentCut=(currentCut+1)%PANELS;const beat=beatForPanel(currentCut);showComic(n,currentCut);playSfx(n,beat)},PANEL_MS)};
const oldRender=typeof render==='function'?render:null;
if(oldRender){render=function(){oldRender();const cc=E('comicCount');if(cc)cc.textContent=`곡마다 최대 ${PANELS}장 자동 순서 · 추가 ${comics.length}장`;const scripts=E('scripts');if(scripts)scripts.querySelectorAll('.script .meta').forEach(x=>{if(x.textContent.includes('만화 6컷'))x.textContent=x.textContent.replace('만화 6컷',`만화 ${PANELS}장`)})}}
})();