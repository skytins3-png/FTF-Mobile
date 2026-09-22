(()=>{
const $=id=>document.getElementById(id);
const css=document.createElement('style');
css.textContent='#bigoDirect{border:1px solid #315b79}#bigoDirect .m{display:grid;grid-template-columns:1fr 1fr;gap:8px}body.ftf-bigo-mobile #viewer{width:min(100vw,56.25vh);height:min(100vh,177.78vw);inset:50% auto auto 50%;transform:translate(-50%,-50%)}body.ftf-bigo-mobile #viewer img,body.ftf-bigo-pc #viewer img{object-fit:contain;background:#000}body.ftf-bigo-pc #viewer{inset:0}';
document.head.appendChild(css);
const goal=document.querySelector('.goal');
if(!goal)return;
const box=document.createElement('section');box.className='card';box.id='bigoDirect';
box.innerHTML='<h2>📡 BIGO LIVE 방송 모드</h2><div class="m"><button id="bigoM" class="green">📱 모바일 9:16</button><button id="bigoP">🖥 PC 전체화면</button></div><div class="grid" style="margin-top:8px"><button id="bigoGo" class="secondary">▶ 방송 화면 시작</button><button id="bigoStop" class="secondary">■ 방송 모드 종료</button></div><p class="note">OBS 없이 BIGO 화면공유/화면송출용. FTF 음악은 기존 단일 재생 경로를 사용합니다.</p>';
goal.insertAdjacentElement('afterend',box);
let mode=localStorage.getItem('ftf_bigo_direct')||'mobile';
function setMode(v){mode=v;localStorage.setItem('ftf_bigo_direct',v);document.body.classList.toggle('ftf-bigo-mobile',v==='mobile');document.body.classList.toggle('ftf-bigo-pc',v==='pc');}
$('bigoM').onclick=()=>setMode('mobile');$('bigoP').onclick=()=>setMode('pc');
$('bigoGo').onclick=async()=>{setMode(mode);try{await document.documentElement.requestFullscreen()}catch(_){}try{audioCtx()}catch(_){}try{startAuto('movie')}catch(_){try{showComic(1,0)}catch(__){}}};
$('bigoStop').onclick=()=>{document.body.classList.remove('ftf-bigo-mobile','ftf-bigo-pc');try{runToken++;autoMode=null;clearRun();speechSynthesis.cancel();if(window.FTFStopAudioNow)window.FTFStopAudioNow();else stopAudio()}catch(_){}try{$('viewer').classList.remove('show')}catch(_){}try{if(document.fullscreenElement)document.exitFullscreen()}catch(_){}};
setMode(mode);
})();