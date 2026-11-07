(() => {
  const vids = window.VIDEOS || []

  // ---------- RECOMMENDED GRID: LOCAL VIDEO FILES, HOVER = UNMUTED PREVIEW ----------
  // "#T=8" MAKES THE BROWSER SHOW THE FRAME AT 8 SECONDS AS THE THUMBNAIL. WORKS FROM A DOUBLE-CLICKED FILE TOO.
  const slug = (v) => v.file.replace(/^videos\/|\.webm$/g, '')
  C.$('#recs').innerHTML = vids.map((v) => `<div class="col-4"><div class="window rec-card" data-hover data-id="${slug(v)}">
      <div class="title-bar inactive"><div class="title-bar-text">${v.title}</div>
        <div class="title-bar-controls"><button class="tb" aria-label="CLOSE">✕</button></div></div>
      <div class="window-body"><div class="screen"><video muted loop playsinline preload="metadata" src="${v.file}#t=8"></video>
        <span class="length">${C.fmtLength(v.seconds)}</span></div></div>
      <div class="status-bar"><p class="status-bar-field">${C.viewsText(slug(v), v.views)}</p><p class="status-bar-field">${C.ago(v.recorded)}</p></div>
    </div></div>`).join('')
  C.$$('.rec-card').forEach((card) => {
    const pv = card.querySelector('video'), bar = card.querySelector('.title-bar')
    // HOVERED CARD BECOMES THE "ACTIVE WINDOW" (BLUE TITLE BAR) AND PLAYS UNMUTED
    const on = () => {
      bar.classList.remove('inactive')
      if (C.calm) return
      pv.muted = false
      pv.volume = 1
      pv.play().catch(() => {})
    }
    const off = () => { bar.classList.add('inactive'); pv.pause(); pv.muted = true }
    card.addEventListener('mouseenter', on); card.addEventListener('fakeenter', on)
    card.addEventListener('mouseleave', off); card.addEventListener('fakeleave', off)
    card.addEventListener('click', () => {
      // MANDATORY FUN: THE WHOLE VIDIOT.EXE BODY BECOMES A LOADING SCREEN (JS/FUN.JS), THEN THE WATCH PAGE OPENS
      C.loading(C.$('.recs .window-body'), undefined, () => (location.href = `watch.html?v=${card.dataset.id}`))
    })
  })

  // ---------- ADS ----------
  const ADS = ['🖥️ DOWNLOAD MORE RAM — 100% LEGIT', '⚠️ YOUR PC HAS 3,412 VIRUSES. (IT DOES NOT. CLICK ANYWAY.)',
    '🎓 LEARN RUST IN 3 SECONDS. SECOND 1: NO.', '🧠 ONE WEIRD TRICK TO CENTER A DIV. CSS HATES HIM.',
    '☁️ CLOUD BILL TOO LOW? WE CAN FIX THAT.', '📞 HOT RECRUITERS IN YOUR AREA WANT YOUR RÉSUMÉ',
    // MANDATORY FUN: OLD MEMES, ORIGINAL RE-TELLINGS
    '🐕 SUCH AD. VERY SPONSOR. WOW.', '👾 ALL YOUR BASE ARE BELONG TO US. (WE ARE A BANK NOW.)',
    '🍔 I CAN HAS CHEEZBURGER? NO. U CAN HAS AD.', '🚧 THIS AD IS UNDER CONSTRUCTION. BEST VIEWED IN NETSCAPE.']
  C.$$('.ad').forEach((ad, i) => {
    let k = i * 2
    const show = () => (ad.querySelector('.ad-text').textContent = ADS[k++ % ADS.length])
    show()
    setInterval(show, 8000)
    ad.addEventListener('click', () => C.status('THANKS FOR YOUR INTEREST! OPENING 0 NEW TABS.'))
  })

  // ---------- WINDOW BUTTONS NEVER WORK; THE TASKBAR IS DECORATIVE ----------
  const NOPE = ['ACCESS DENIED.', 'THIS WINDOW CANNOT BE CLOSED. IT IS LOAD-BEARING.', 'ARE YOU SURE? (THAT WAS NOT A QUESTION.)',
    'ERROR 67: BUTTON NOT FOUND.', 'MINIMIZING IS A PREMIUM FEATURE.']
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.tb')) return
    e.stopPropagation()
    C.status(C.pick(NOPE))
    C.beep(220, 120)
  }, true)
  C.$('#start-menu').addEventListener('click', () => C.status('THERE IS NO START. ONLY END.'))
  const tick = () => (C.$('#clock').textContent = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }).toUpperCase())
  tick()
  setInterval(tick, 10000)
})()
