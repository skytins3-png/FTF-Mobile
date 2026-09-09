(()=>{
  if(document.getElementById('ftfLyricComicStudio'))return;
  const DEMO_TITLE='지구의 경고 · 테스트';
  const DEMO_LYRICS=`새벽 바다 위로 붉은 빛이 번져 온다
평범했던 계절의 리듬이 조금씩 흔들린다
뜨거워진 바다는 거대한 숨을 품고
먼 수평선 위 검은 구름이 빠르게 자란다
빙하 절벽에 깊은 균열이 번지고
천년의 얼음이 굉음과 함께 바다로 무너진다
메마른 숲 끝에서 작은 불꽃이 일어나고
강한 바람을 타고 산등성이 전체로 번진다
도시는 갑작스러운 폭우에 잠기기 시작하고
도로와 지하차도에 거센 물살이 몰려온다
사이렌 소리에 사람들은 높은 곳을 향해 달리고
구조대의 불빛이 빗속을 가르며 움직인다
병원 응급실은 젖은 사람들로 가득 차고
학교 체육관은 임시 대피소로 바뀐다
과학자들은 지하 상황실에 모여 지구 지도를 바라본다
기후 데이터와 피해 예측이 거대한 화면을 채운다
우리는 더 늦기 전에 선택해야 한다
누군가는 두려워하고 누군가는 손을 내민다
폭풍이 지나간 거리에는 진흙과 잔해가 남고
아이들은 깨진 창문 너머의 하늘을 올려다본다
잠시 뒤 구름 사이로 햇빛 한 줄기가 내려오고
사람들은 서로를 일으켜 세우며 다시 걷기 시작한다
항구에는 거대한 구조선과 보급선이 출항을 준비한다
엔진이 깨어나고 갑판 위 사람들이 마지막 점검을 한다
배는 잔잔해진 바다를 가르며 새로운 수평선을 향하고
지구의 내일은 오늘 우리의 선택에서 시작된다`;
  const style=document.createElement('style');style.textContent=`
  #ftfLyricComicStudio textarea,#ftfLyricComicStudio input,#ftfLyricComicStudio select{width:100%;background:#0f131b;color:#fff;border:1px solid #394354;border-radius:12px;padding:11px;font:inherit}#ftfLyricComicStudio textarea{min-height:220px;resize:vertical}#ftfLyricComicStudio .lcrow{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px}#ftfLyricComicStudio .lcscene{border:1px solid #344054;border-radius:14px;padding:10px;margin-top:8px;background:#111824}#ftfLyricComicStudio .lcscene b{color:#b9d7ff}#ftfLyricComicStudio .lcsmall{font-size:11px;color:#aeb8c6;line-height:1.5}#ftfLyricComicStudio .lcprompt{white-space:pre-wrap;font-size:11px;color:#dce6f2;margin-top:6px}`;document.head.appendChild(style);
  const wrap=document.querySelector('.wrap');if(!wrap)return;
  const sec=document.createElement('section');sec.className='card';sec.id='ftfLyricComicStudio';sec.innerHTML=`<h2>🎨 가사 → 26장면 만화 자동 제작</h2><div class="note">노래 가사를 붙여 넣으면 곡의 흐름을 26개 장면으로 나누고, 각 장면의 인물·배경·상황·대사·SFX·시네마틱 이미지 프롬프트를 자동 생성합니다. 기존 곡/만화는 삭제하지 않습니다.</div><div class="lcrow"><select id="lcTrack"></select><input id="lcTitle" placeholder="새 곡 제목 또는 기존 곡 제목"></div><textarea id="lcLyrics" placeholder="여기에 노래 가사를 붙여 넣으세요"></textarea><div class="lcrow"><button id="lcBuild" class="green">26장면 자동 분석</button><button id="lcDemo" class="secondary">테스트 가사 넣기</button></div><div class="lcrow"><button id="lcSave" class="secondary">프로젝트 저장</button><button id="lcPreview" class="secondary">분석 결과 보기</button></div><div class="lcrow"><input id="lcEndpoint" placeholder="선택: AI 이미지 서버 URL"><button id="lcGenerate" class="secondary">AI 만화 이미지 생성</button></div><div id="lcStatus" class="note" style="margin-top:8px"></div><div id="lcScenes"></div>`;
  wrap.insertBefore(sec,wrap.firstElementChild?.nextSibling||null);
  const q=id=>document.getElementById(id),track=q('lcTrack');
  track.innerHTML='<option value="new">새 프로젝트</option>'+((window.PROJECT_TRACKS||[]).map(t=>`<option value="${t.no}">FTF-${String(t.no).padStart(2,'0')} ${t.title}</option>`).join(''));
  const clean=s=>String(s||'').replace(/\[[^\]]+\]/g,' ').replace(/\s+/g,' ').trim();
  function chunks(text){const raw=String(text||'').split(/\n+/).map(clean).filter(Boolean);if(!raw.length)return[];const out=[];for(let i=0;i<26;i++){const a=Math.floor(i*raw.length/26),b=Math.max(a+1,Math.floor((i+1)*raw.length/26));out.push(raw.slice(a,b).join(' / ')||raw[Math.min(a,raw.length-1)]);}return out}
  function infer(line,i){const t=line.toLowerCase();let place='cinematic real-world environment',mood='dramatic emotional';if(/바다|ocean|sea|파도/.test(t))place='stormy ocean and harbor';else if(/비|폭우|태풍|storm|rain/.test(t))place='flooded city in violent storm';else if(/불|산불|fire/.test(t))place='wildfire near a threatened town';else if(/눈|빙하|ice|snow/.test(t))place='glacier and frozen mountain landscape';else if(/학교|school/.test(t))place='school and evacuation shelter';else if(/병원|hospital/.test(t))place='hospital emergency ward';else if(/회의|연구|과학|meeting|scientist|상황실|데이터/.test(t))place='high-tech crisis command room';else if(/사랑|그리움|love/.test(t))place='quiet city night with two lead characters';else if(/출항|배|ship|sail|항구/.test(t))place='large expedition ship at sea';else if(/구조대|대피|사이렌/.test(t))place='urban emergency evacuation scene';
    const sfx=/폭우|비|rain/.test(t)?'SHAAAAA':/불|fire/.test(t)?'FWOOSH':/빙하|ice/.test(t)?'CRAAACK':/태풍|storm/.test(t)?'WOOOOSH':/사이렌/.test(t)?'WEE-OO':'BEEP…';
    return {scene:i+1,lyric:line,place,mood,sfx,dialogue:line.length>58?line.slice(0,58)+'…':line,narration:`장면 ${i+1}: ${line}`,prompt:`Vertical 9:16 polished cinematic manga/webtoon scene, actual illustrated characters and detailed ${place}, ${mood} lighting, expressive faces, cinematic camera angle, no stick figures, no flat icon art, no blank cards. Story beat: ${line}. Include a natural speech bubble containing: “${line.length>44?line.slice(0,44)+'…':line}”. Include a comic caption box for the situation, scene-specific visual SFX “${sfx}”, and multilingual Korean / Chinese / English caption treatment where appropriate. Keep characters visually consistent across the 26-scene sequence.`}}
  function build(){const c=chunks(q('lcLyrics').value);if(!c.length){q('lcStatus').textContent='가사를 먼저 입력하세요.';return}window.FTFLyricComicDraft={title:q('lcTitle').value.trim(),track:q('lcTrack').value,scenes:c.map(infer),created:new Date().toISOString()};render();q('lcStatus').textContent='26장면 분석 완료 · 각 장면별 상황/SFX/이미지 프롬프트 생성됨';}
  function render(){const d=window.FTFLyricComicDraft;if(!d)return;q('lcScenes').innerHTML=d.scenes.map(s=>`<div class="lcscene"><b>${String(s.scene).padStart(2,'0')} / 26</b><div>${s.lyric}</div><div class="lcsmall">상황: ${s.place} · SFX: ${s.sfx}</div><div class="lcprompt">${s.prompt.replace(/[&<>]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[m]))}</div></div>`).join('')}
  function loadDemo(){q('lcTitle').value=DEMO_TITLE;q('lcLyrics').value=DEMO_LYRICS;track.value='1';build();q('lcStatus').textContent='테스트곡 입력 완료 · 26장면 자동 분석 결과가 아래에 표시됩니다.';}
  q('lcBuild').onclick=build;q('lcDemo').onclick=loadDemo;q('lcPreview').onclick=()=>{if(!window.FTFLyricComicDraft)build();q('lcScenes')?.scrollIntoView({behavior:'smooth',block:'start'})};
  q('lcSave').onclick=()=>{if(!window.FTFLyricComicDraft)build();if(!window.FTFLyricComicDraft)return;const key='ftf_lyric_comic_projects_v1',all=JSON.parse(localStorage.getItem(key)||'[]');all.push(window.FTFLyricComicDraft);localStorage.setItem(key,JSON.stringify(all));q('lcStatus').textContent=`프로젝트 저장됨 · 총 ${all.length}개`;};
  q('lcGenerate').onclick=async()=>{if(!window.FTFLyricComicDraft)build();const d=window.FTFLyricComicDraft,ep=q('lcEndpoint').value.trim();if(!d)return;if(!ep){q('lcStatus').textContent='26장면 설계는 완료됐습니다. 실제 이미지 자동 생성은 AI 이미지 서버 URL을 연결하면 순서대로 실행됩니다.';return}q('lcStatus').textContent='AI 이미지 생성 요청 중…';try{for(const s of d.scenes){const r=await fetch(ep,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({track:d.track,title:d.title,scene:s.scene,total:26,prompt:s.prompt,lyric:s.lyric,sfx:s.sfx})});if(!r.ok)throw new Error('scene '+s.scene);const data=await r.json();s.image=data.image||data.url||null;q('lcStatus').textContent=`${s.scene}/26 생성 완료`;}localStorage.setItem('ftf_lyric_comic_last_v1',JSON.stringify(d));q('lcStatus').textContent='26장면 이미지 생성 완료 · 프로젝트 데이터에 연결됨';}catch(e){q('lcStatus').textContent='이미지 서버 연결 오류: '+e.message;}};
  loadDemo();
})();