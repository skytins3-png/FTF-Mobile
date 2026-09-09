(()=>{
  const viewer=document.getElementById('viewer');
  const img=document.getElementById('comicImg');
  if(!viewer||!img)return;

  const style=document.createElement('style');
  style.id='ftfCinematicUiStyle';
  style.textContent=`
    .viewer.ftf-integrated{background:#05080d!important;padding:0!important;overflow:hidden!important}
    .viewer.ftf-integrated #comicImg{inset:74px 0 168px 0!important;width:100%!important;height:calc(100% - 242px)!important;object-fit:contain!important;background:#05080d!important}
    .viewer.ftf-integrated .vtop{z-index:130!important;right:12px!important;top:8px!important}
    .viewer.ftf-integrated #closeViewer{width:48px!important;height:48px!important;border-radius:15px!important;font-size:24px!important}
    #ftfCinemaHead{display:none;position:absolute;left:0;right:0;top:0;height:74px;z-index:120;background:linear-gradient(180deg,#08111df8,#0b1420f2);border-bottom:1px solid #2b4059;padding:10px 68px 9px 14px;color:#fff}
    .viewer.ftf-integrated #ftfCinemaHead{display:flex;align-items:center;justify-content:space-between;gap:12px}
    #ftfCinemaBrand{min-width:0}#ftfCinemaBrand b{display:block;font-size:18px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#ftfCinemaBrand span{display:block;margin-top:3px;color:#b9cbe0;font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    #ftfCinemaScene{flex:0 0 auto;text-align:center;border:1px solid #39516d;background:#101a28;border-radius:16px;padding:7px 11px;min-width:76px}#ftfCinemaScene strong{display:block;font-size:16px;letter-spacing:1px}#ftfCinemaScene small{display:block;color:#b7c5d6;font-size:9px;margin-top:2px}
    #ftfCinemaPlayer{display:none;position:absolute;left:0;right:0;bottom:0;height:168px;z-index:125;background:linear-gradient(180deg,#101a27f7,#0a111cfb);border-top:1px solid #33475f;color:#fff;padding:10px 12px calc(10px + env(safe-area-inset-bottom))}
    .viewer.ftf-integrated #ftfCinemaPlayer{display:block}
    #ftfTrackRow{display:grid;grid-template-columns:54px 1fr;gap:10px;align-items:center}#ftfThumb{width:54px;height:54px;border-radius:10px;border:1px solid #7892af;background:#152233 center/cover no-repeat}#ftfTrackText{min-width:0}#ftfTrackTitle{font-weight:900;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#ftfTrackKo{font-size:11px;color:#c1cfdf;margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    #ftfTimeRow{display:grid;grid-template-columns:38px 1fr 38px;gap:8px;align-items:center;margin-top:7px;font-size:10px;color:#bcc8d5}#ftfProgress{height:5px;border-radius:99px;background:#30445d;overflow:hidden}#ftfProgressFill{height:100%;width:0;background:#5ec8ff;border-radius:99px}
    #ftfControlRow{display:grid;grid-template-columns:1fr 1fr 1fr 1.25fr 1.25fr 1.25fr;gap:7px;margin-top:9px}#ftfControlRow button{min-width:0;height:44px;padding:0 5px;border-radius:13px;background:#152131;color:#fff;border:1px solid #41536b;font-weight:900;font-size:11px}#ftfControlRow button.primary{background:#eef4fb;color:#09111d;font-size:20px;border-color:#fff}
    #ftfLiveBadge{position:fixed;right:10px;bottom:8px;z-index:9999;background:#0b2238e8;border:1px solid #5ec8ff;color:#d9f4ff;border-radius:999px;padding:5px 9px;font-size:10px;font-weight:900;letter-spacing:.5px;pointer-events:none}
    .viewer.ftf-integrated #ftfPanelProgress{display:none!important}
    @media (max-width:390px){#ftfCinemaHead{height:68px;padding-left:10px}.viewer.ftf-integrated #comicImg{inset:68px 0 160px 0!important;height:calc(100% - 228px)!important}#ftfCinemaPlayer{height:160px}#ftfControlRow{gap:5px}#ftfControlRow button{font-size:10px}}
  `;
  document.head.appendChild(style);

  let badge=document.getElementById('ftfLiveBadge');
  if(!badge){badge=document.createElement('div');badge.id='ftfLiveBadge';badge.textContent='FTF LIVE v50';document.body.appendChild(badge)}

  const head=document.createElement('div');head.id='ftfCinemaHead';head.innerHTML='<div id="ftfCinemaBrand"><b id="ftfCinemaTitle">미래를 위하여 · FTF</b><span id="ftfCinemaSub">For the Future · FTF</span></div><div id="ftfCinemaScene"><strong id="ftfCinemaCounter">01 / 26</strong><small>시작되는 새로운 여정</small></div>';
  viewer.appendChild(head);
  const player=document.createElement('div');player.id='ftfCinemaPlayer';player.innerHTML='<div id="ftfTrackRow"><div id="ftfThumb"></div><div id="ftfTrackText"><div id="ftfTrackTitle">FTF</div><div id="ftfTrackKo"></div></div></div><div id="ftfTimeRow"><span id="ftfElapsed">00:00</span><div id="ftfProgress"><div id="ftfProgressFill"></div></div><span id="ftfDuration">00:00</span></div><div id="ftfControlRow"><button id="ftfPrev" aria-label="이전">⏮</button><button id="ftfPlay" class="primary" aria-label="재생 일시정지">▶</button><button id="ftfNext" aria-label="다음">⏭</button><button id="ftfComic">📖 만화</button><button id="ftfList">☷ 목록</button><button id="ftfSettings">⚙ 설정</button></div>';
  viewer.appendChild(player);

  const q=id=>document.getElementById(id), fmt=s=>{s=Math.max(0,Number.isFinite(s)?s:0);const m=Math.floor(s/60),ss=Math.floor(s%60);return `${String(m).padStart(2,'0')}:${String(ss).padStart(2,'0')}`};
  function currentTrack(){try{return PROJECT_TRACKS[(typeof currentScene==='number'?currentScene:1)-1]||PROJECT_TRACKS[0]}catch(e){return {no:1,title:"Earth's Warning",ko:'지구의 경고'}}}
  function media(){try{return typeof audio!=='undefined'?audio:null}catch(e){return null}}
  function sync(){
    const integrated=viewer.classList.contains('ftf-integrated');if(!integrated)return;
    const t=currentTrack(),scene=Math.max(0,Math.min(25,Number(window.ftfSceneIndex)||0));
    q('ftfCinemaTitle').textContent=`FTF-${String(t.no).padStart(2,'0')}  ${t.title}`;
    q('ftfCinemaSub').textContent=t.ko||'';q('ftfCinemaCounter').textContent=`${String(scene+1).padStart(2,'0')} / 26`;
    q('ftfTrackTitle').textContent=`FTF-${String(t.no).padStart(2,'0')}  ${t.title}`;q('ftfTrackKo').textContent=t.ko||'';
    const src=img.currentSrc||img.src||'';q('ftfThumb').style.backgroundImage=src?`url("${src.replace(/"/g,'')}")`:'none';
    const a=media(),dur=a&&Number.isFinite(a.duration)?a.duration:0,cur=a&&Number.isFinite(a.currentTime)?a.currentTime:0;
    q('ftfElapsed').textContent=fmt(cur);q('ftfDuration').textContent=fmt(dur);q('ftfProgressFill').style.width=dur?`${Math.min(100,cur/dur*100)}%`:'0%';q('ftfPlay').textContent=a&&!a.paused?'Ⅱ':'▶';
  }
  q('ftfPrev').onclick=()=>document.getElementById('prev')?.click();q('ftfNext').onclick=()=>document.getElementById('next')?.click();q('ftfPlay').onclick=()=>document.getElementById('pause')?.click();
  q('ftfComic').onclick=()=>document.getElementById('openComic')?.click();
  q('ftfList').onclick=()=>{document.getElementById('closeViewer')?.click();document.getElementById('catalogList')?.scrollIntoView({behavior:'smooth',block:'start'})};
  q('ftfSettings').onclick=()=>{document.getElementById('closeViewer')?.click();document.getElementById('musicCount')?.scrollIntoView({behavior:'smooth',block:'center'})};
  const mo=new MutationObserver(sync);mo.observe(viewer,{attributes:true,attributeFilter:['class']});mo.observe(img,{attributes:true,attributeFilter:['src']});img.addEventListener('load',sync);
  setInterval(sync,500);
  try{const headings=[...document.querySelectorAll('h2')];const h=headings.find(x=>x.textContent.includes('대본 7장면'));if(h)h.textContent=h.textContent.replace('대본 7장면','대본 8장면')}catch(e){}
  sync();
})();