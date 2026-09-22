(()=>{
const $=id=>document.getElementById(id);
const style=document.createElement('style');
style.textContent=`
#bigoDirectStatic{position:sticky;top:0;z-index:80;margin:0 0 10px;border:2px solid #39bdf8;background:#111923;padding:10px!important}
#bigoDirectStatic h2{font-size:18px;margin:0 0 8px}
#bigoDirectStatic .mode{gap:8px}
#bigoDirectStatic button{min-height:58px;font-size:17px;touch-action:manipulation}
#bigoDirectStatic .note{margin:7px 2px 0}
body.ftf-bigo-mobile #viewer{width:100vw;height:100dvh;inset:0;transform:none;background:#000}
body.ftf-bigo-mobile #viewer img,body.ftf-bigo-pc #viewer img{object-fit:contain;background:#000}
body.ftf-bigo-pc #viewer{inset:0;background:#000}
`;
document.head.appendChild(style);
const panel=$('bigoDirectStatic');
if(!panel)return;
const buttons=panel.querySelectorAll('button');
const mobile=buttons[0],pc=buttons[1];
let actions=panel.querySelector('.bigo-actions');
if(!actions){actions=document.createElement('div');actions.className='bigo-actions grid';actions.style.marginTop='8px';actions.innerHTML='<button id="bigoGoStatic" class="secondary">▶ 바로 방송 시작</button><button id="bigoExitStatic" class="secondary">■ 종료</button>';panel.insertBefore(actions,panel.querySelector('.note'))}
let mode=localStorage.getItem('ftf_bigo_direct')||'mobile';
function setMode(v){mode=v;localStorage.setItem('ftf_bigo_direct',v);document.body.classList.toggle('ftf-bigo-mobile',v==='mobile');document.body.classList.toggle('ftf-bigo-pc',v==='pc');mobile.textContent=(v==='mobile'?'✓ ':'')+'📱 모바일 9:16';pc.textContent=(v==='pc'?'✓ ':'')+'🖥 PC 전체화면'}
async function start(v){setMode(v||mode);try{audioCtx()}catch(_){}try{E('viewer').classList.add('show');showComic(currentScene||1,currentCut||0)}catch(_){}try{startAuto('movie')}catch(_){}try{if(!document.fullscreenElement)await document.documentElement.requestFullscreen()}catch(_){}}
mobile.onclick=e=>{e.preventDefault();start('mobile')};
pc.onclick=e=>{e.preventDefault();start('pc')};
$('bigoGoStatic').onclick=e=>{e.preventDefault();start(mode)};
$('bigoExitStatic').onclick=e=>{e.preventDefault();try{runToken++;autoMode=null;clearRun();speechSynthesis.cancel();if(window.FTFStopAudioNow)window.FTFStopAudioNow();else stopAudio()}catch(_){}try{$('viewer').classList.remove('show')}catch(_){}document.body.classList.remove('ftf-bigo-mobile','ftf-bigo-pc');try{if(document.fullscreenElement)document.exitFullscreen()}catch(_){}};
setMode(mode);
})();