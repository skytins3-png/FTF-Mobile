(()=>{
const SPRITE='./ftf_story_images.jpg';
const MAP={
1:[0,10,19,16,13,14],
2:[21,3,4,7,17,6],
3:[5,23,15,20,9,8],
4:[22,18,2,24,1,11],
5:[12,19,8,20,9,2],
6:[24,18,15,1,11,5],
7:[23,12,7,6,3,4]
};
let galleryTimer=null,galleryIndex=0;
const style=document.createElement('style');
style.textContent=`#ftfBuiltImage{position:absolute;inset:0;background-image:url('${SPRITE}');background-repeat:no-repeat;background-size:500% 500%;background-position:0 0;display:none;z-index:0}#comicImg{z-index:0}.ftfImageCard{border-left:4px solid #5ea3ff}.ftfImageCard button{width:100%;margin-top:8px}`;
document.head.appendChild(style);
const viewer=E('viewer'),img=E('comicImg');
const built=document.createElement('div');built.id='ftfBuiltImage';viewer.insertBefore(built,viewer.firstChild);
function setSprite(i){i=((i%25)+25)%25;let c=i%5,r=Math.floor(i/5);built.style.backgroundPosition=`${c*25}% ${r*25}%`;built.style.display='block';img.style.display='none';}
function restoreImg(){built.style.display='none';img.style.display='block';}
const oldShow=showComic;
showComic=async function(n,cut){
  const sc=SCRIPT[n-1],ci=((cut%6)+6)%6,a=sceneComics(n),custom=a.length?a[ci%a.length]:null;
  if(custom){restoreImg();return oldShow(n,cut);}
  E('viewer').classList.add('show');E('viewerTitle').textContent=sc.name;E('viewerStatus').textContent=`대본 ${String(n).padStart(2,'0')} · 제작 이미지 ${MAP[n][ci]+1}/25`;
  E('sfxText').textContent=sc.sfx[ci];E('situation').textContent='상황 · '+sc.sit[ci];E('captionKo').innerHTML='<span class="langtag">KR</span>'+sc.ko[ci];E('captionZh').innerHTML='<span class="langtag">中文</span>'+sc.zh[ci];
  setSprite(MAP[n][ci]);
};
function showGallery(i){clearInterval(galleryTimer);E('viewer').classList.add('show');E('viewerTitle').textContent='미래를 위하여 · 제작 이미지';E('viewerStatus').textContent=`이 대화에서 만든 이미지 ${i+1}/25`;E('sfxText').textContent='FTF';E('situation').textContent='미래를 위하여 프로젝트에서 제작한 실제 이미지';E('captionKo').textContent='미래를 위하여 · 제작 이미지';E('captionZh').textContent='为了未来 · 项目画面';setSprite(i);galleryIndex=i;galleryTimer=setInterval(()=>{galleryIndex=(galleryIndex+1)%25;E('viewerStatus').textContent=`이 대화에서 만든 이미지 ${galleryIndex+1}/25`;setSprite(galleryIndex)},3500)}
const wrap=document.querySelector('.wrap');if(wrap){const card=document.createElement('section');card.className='card ftfImageCard';card.innerHTML='<h2>🖼 이 대화에서 만든 「미래를 위하여」 이미지</h2><div class="note">실제 제작 이미지 25장을 프로그램에 내장했습니다. 라디오 만화 재생 때 자동으로 사용합니다.</div><button id="ftfGallery" class="secondary">🎞 제작 이미지 25장 보기</button>';const addComic=[...wrap.querySelectorAll('section.card')].find(x=>x.textContent.includes('추가 만화'));if(addComic)wrap.insertBefore(card,addComic);else wrap.appendChild(card);E('ftfGallery').onclick=()=>showGallery(0)}
if(E('comicCount'))E('comicCount').textContent=`제작 이미지 25장 내장 · 사용자 추가 ${comics.length}장`;
const oldClose=E('closeViewer').onclick;E('closeViewer').onclick=e=>{clearInterval(galleryTimer);galleryTimer=null;restoreImg();if(oldClose)oldClose.call(E('closeViewer'),e);else E('viewer').classList.remove('show')};
})();