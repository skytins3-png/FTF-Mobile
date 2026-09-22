(()=>{
  const apply=()=>{
    const b=document.getElementById('ftfLiveBadge');
    if(b)b.textContent='FTF LIVE v61';
    document.documentElement.dataset.ftfBuild='61';
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();

  // Force-load the full-track playback guard even when an older service worker is still controlling the page.
  const loadGuard=()=>{
    if(window.FTFFullTrackPlayback)return;
    if(document.getElementById('ftfFullTrackPlaybackLoader'))return;
    const s=document.createElement('script');
    s.id='ftfFullTrackPlaybackLoader';
    s.src='./ftf-full-track-playback.js?force=61';
    s.async=false;
    document.body.appendChild(s);
    if(!document.getElementById('ftfBigoDirectLoader')){const b=document.createElement('script');b.id='ftfBigoDirectLoader';b.src='./ftf-bigo-direct.js?force=61';b.async=false;document.body.appendChild(b);}
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',loadGuard,{once:true});else loadGuard();

  // Ask the browser to re-check the service worker immediately using a cache-busting script URL.
  if('serviceWorker' in navigator){
    navigator.serviceWorker.register('./sw.js?force=61').then(reg=>reg.update()).catch(()=>{});
  }
})();
