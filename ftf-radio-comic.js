(()=>{
  const scene8={n:8,name:'미래를 위하여 · 출항',track:8,
    en:'A new morning begins. The fleet sets sail toward a wider tomorrow. The road will not be easy, but together we can protect our Earth and keep moving forward.',
    ko:['새로운 아침, 우리는 다시 바다로 나선다.','이제 출항이야. 모두 준비됐지?','우리가 가는 길은 쉽지 않지만 반드시 해낼 거야.','지구를 위해, 우리의 미래를 위해.','우리의 작은 노력이 지구를 지킬 수 있어.','함께라면 더 멀리 갈 수 있어.'],
    zh:['新的早晨，我们再次驶向大海。','现在出航！大家都准备好了吗？','前方的道路并不容易，但我们一定会做到。','为了地球，也为了我们的未来！','我们小小的努力，也能守护地球。','只要在一起，我们能走得更远！'],
    sit:['해가 떠오르는 바다 위로 FTF 함대가 출항한다.','함교에서 출항 명령이 내려진다.','거친 파도를 가르며 함대가 전진한다.','대원들이 지구 화면을 바라보며 임무를 확인한다.','각 함선이 대형을 맞추며 항로를 잡는다.','함대가 수평선을 향해 함께 나아간다.'],
    sfx:['WOOOSH!','ALL READY!','RUMBLE…','BEEP','WHOOSH!','FORWARD!']};
  try{if(Array.isArray(SCRIPT)&&!SCRIPT.some(s=>s.n===8))SCRIPT.push(scene8)}catch(e){console.warn('FTF scene 8 add',e)}

  const css=document.createElement('style');
  css.textContent=`
  .subtitleWrap{display:none!important}.situation{left:4%!important;right:4%!important;bottom:auto!important;top:17%!important;background:#fffdf2f2!important;color:#111!important;border:4px solid #111!important;border-left:10px solid #ffd65c!important;border-radius:10px!important;text-shadow:none!important;font-size:clamp(13px,3.4vw,20px)!important;line-height:1.35!important;box-shadow:0 8px 24px #0008}
  .ftfBubble{position:absolute;z-index:7;max-width:72%;background:#fff;color:#111;border:4px solid #111;border-radius:30px;padding:13px 16px;box-shadow:0 8px 24px #0009;font-weight:900;line-height:1.3;text-align:center}
  .ftfBubble.left{left:4%;bottom:8%}.ftfBubble.right{right:4%;bottom:8%}.ftfBubble:after{content:'';position:absolute;bottom:-24px;width:0;height:0;border-style:solid}.ftfBubble.left:after{left:28px;border-width:24px 24px 0 0;border-color:#111 transparent transparent transparent}.ftfBubble.right:after{right:28px;border-width:24px 0 0 24px;border-color:#111 transparent transparent transparent}
  .ftfBubbleKo{font-size:clamp(18px,4.8vw,30px)}.ftfBubbleZh{font-size:clamp(14px,3.8vw,22px);font-weight:800;color:#444;margin-top:7px}.ftfBubbleTag{font-size:11px;color:#777;margin-right:4px}.sfx{z-index:8!important;top:35%!important;font-size:clamp(28px,8vw,56px)!important}.vtitle,.vstatus,.vtop{z-index:9!important}`;
  document.head.appendChild(css);

  const viewer=E('viewer');
  const bubble=document.createElement('div'); bubble.id='ftfSpeechBubble'; bubble.className='ftfBubble left';
  bubble.innerHTML='<div class="ftfBubbleKo"></div><div class="ftfBubbleZh"></div>';
  viewer.appendChild(bubble);

  function renderBubble(n,cut){
    const sc=SCRIPT[n-1]||SCRIPT.find(s=>s.n===n); if(!sc)return;
    const i=((cut%6)+6)%6;
    bubble.className='ftfBubble '+(i%2?'right':'left');
    bubble.querySelector('.ftfBubbleKo').innerHTML='<span class="ftfBubbleTag">KR</span>'+(sc.ko?.[i]||'');
    bubble.querySelector('.ftfBubbleZh').innerHTML='<span class="ftfBubbleTag">中文</span>'+(sc.zh?.[i]||'');
    bubble.style.display='block';
  }

  const hook=()=>{
    if(typeof showComic!=='function')return;
    const prev=showComic;
    showComic=async function(n,cut){const r=await prev(n,cut);renderBubble(n,cut);return r};
  };
  hook();

  const oldClose=E('closeViewer').onclick;
  E('closeViewer').onclick=e=>{bubble.style.display='none';if(oldClose)oldClose.call(E('closeViewer'),e);else E('viewer').classList.remove('show')};
})();