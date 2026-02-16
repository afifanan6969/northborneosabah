// Background music widget: autoplays "Fly Me to the Moon" (Frank Sinatra)
// Expects audio at `assets/franksInatra.mp3` or set `window.BG_MUSIC_URL`
(function(){
  if(window.__bgMusicLoaded) return; window.__bgMusicLoaded = true;

  const musicUrl = window.BG_MUSIC_URL || 'assets/franksinatra.mp3';
  const container = document.createElement('div'); container.className = 'music-widget';

  const btnWrap = document.createElement('div'); btnWrap.className = 'music-button';
  const playBtn = document.createElement('button'); playBtn.type='button'; playBtn.setAttribute('aria-label','Toggle music');
  playBtn.innerText = '♪';
  const label = document.createElement('div'); label.className = 'label'; label.innerText = 'Sinatra';

  btnWrap.appendChild(playBtn); btnWrap.appendChild(label);
  container.appendChild(btnWrap);
  document.body.appendChild(container);

  const audio = new Audio(); audio.src = musicUrl; audio.loop = true; audio.preload = 'auto';
  // Autoplay: start muted (browser autoplay policy), then unmute after user interaction
  audio.muted = true;
  audio.play().catch(()=>{});

  function updateUI(){
    playBtn.innerText = audio.paused ? '◯' : '♪';
  }

  // Click to play/pause; first click also unmutes
  let unmuteOnClick = true;
  playBtn.addEventListener('click', ()=>{
    if(unmuteOnClick && audio.muted) { audio.muted = false; unmuteOnClick = false; }
    if(audio.paused){ audio.play().catch(()=>{}); } else { audio.pause(); }
    updateUI();
  });

  // Hover over label to show mute option
  label.addEventListener('click', ()=>{ audio.muted = !audio.muted; updateUI(); });
  label.addEventListener('keydown', e=>{ if(e.key==='Enter') { e.preventDefault(); label.click(); } });

  audio.addEventListener('error', ()=>{ playBtn.disabled = true; playBtn.style.opacity = '0.4'; });
  setTimeout(updateUI, 300);

  window.BG_MUSIC = { audio, play: ()=>{ audio.play(); updateUI(); }, pause: ()=>{ audio.pause(); updateUI(); }, mute: ()=>{ audio.muted=true; }, unmute: ()=>{ audio.muted=false; } };
})();
