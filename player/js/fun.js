// MANDATORY FUN: A LOADING SCREEN THAT NEVER SAYS WHAT IT IS LOADING.
// C.LOADING(EL, MS, THEN) REPLACES EL'S CONTENT IN PLACE (NO POP-UPS), RUNS MS (DEFAULT 7 S, CALM MODE 5 S), THEN CALLS THEN().
// THE RAINBOW LLAMA IS THE PROGRESS INDICATOR; THE BAR SPRINTS TO 99% AND STALLS THERE. MEMES ARE ORIGINAL TEXT/EMOJI RENDITIONS.
(() => {
  const RICKROLL = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  const MSGS = ['LOADING…', 'ALMOST THERE', 'RETICULATING SPLINES…', 'ALL YOUR BASE ARE BELONG TO US', 'IT\'S OVER 9000!!!',
    'U CAN HAS CHEEZBURGER? NO. U CAN HAS LOADING.', 'THIS IS FINE 🔥', 'PLZ WAIT. PLZ. WAIT.', 'CONVINCING THE HAMSTER…',
    'ALMOST ALMOST THERE', 'SUCH LOAD. VERY WAIT. WOW.', 'DO A BARREL ROLL', 'PRESS F TO PAY RESPECTS', '99% (THE HARD PART)']
  const DOGE = ['SUCH LOAD', 'VERY WAIT', 'WOW', 'MUCH PROGRESS', 'AMAZE']

  C.loading = (el, ms, then) => {
    ms ??= C.calm ? 5000 : 7000
    const visitor = String(Math.floor(C.rand(1, 9999999))).padStart(7, '0')
    el.innerHTML = `<div class="fun" role="status">
      <div class="fun-tape"><span>🚧 UNDER CONSTRUCTION 🚧</span></div>
      <div class="fun-stage"><div class="fun-trail"></div><span class="fun-llama">🦙</span></div>
      <div class="fun-row">
        <span class="fun-baby">👶</span>
        <div class="fun-mid"><b class="fun-msg">${MSGS[0]}</b>
          <div class="progress-indicator segmented fun-bar"><span class="progress-indicator-bar"></span></div>
          <div class="fun-pct">0%</div></div>
        <span class="fun-doge">🐕<i>${DOGE.map((w) => `<em>${w}</em>`).join('')}</i></span>
      </div>
      <div class="fun-foot">
        <a href="${RICKROLL}" target="_blank" rel="noopener" title="NEVER GONNA GIVE YOU UP"><button class="fun-skip">⏩ SKIP LOADING</button></a>
        <span class="fun-hits">YOU ARE VISITOR #${[...visitor].map((d) => `<b>${d}</b>`).join('')}</span>
      </div>
    </div>`
    const q = (s) => el.querySelector(s)
    const bar = q('.progress-indicator-bar'), barBox = q('.fun-bar'), pct = q('.fun-pct'), msg = q('.fun-msg')
    const trail = q('.fun-trail'), llama = q('.fun-llama')
    const t0 = performance.now()
    let i = 0, alive = true
    const rot = setInterval(() => (msg.textContent = MSGS[++i % MSGS.length]), 1300) // TEXT CHANGE, NOT A FLASH (UNDER 1 HZ)
    const step = (now) => {
      if (!alive) return
      const k = Math.min(1, (now - t0) / (ms * 0.5)) // REACH 99% AT HALF TIME, THEN STALL THERE
      const p = Math.floor(99 * (1 - (1 - k) ** 3))
      const inner = barBox.clientWidth - 8
      bar.style.width = Math.floor((inner * p) / 100 / 18) * 18 + 'px' // WHOLE BLOCKS ONLY, LIKE THE REAL THING
      pct.textContent = p + '%'
      trail.style.width = `calc(${p}% - ${p * 0.44 - 8}px)` // ENDS UNDER THE LLAMA
      llama.style.left = `calc(${p}% - ${p * 0.44}px)` // STAYS INSIDE THE TRACK AT 100%
      requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
    // SETTIMEOUT, NOT RAF: KEEPS GOING IF THE RICKROLL TAB PUSHED THIS ONE INTO THE BACKGROUND
    setTimeout(() => { alive = false; clearInterval(rot); then() }, ms)
  }
})()
