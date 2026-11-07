// WATCH PAGE: PLAYS ONE LOCAL VIDEO FROM VIDEOS.JS, PICKED BY ?V=NAME (E.G. ?V=DUCK-RACE), WITH CURSED CONTROLS:
//   SPEED = A CRANK WHEEL (ONE CLOCKWISE TURN = +1×, COUNTER-CLOCKWISE = SLOWER; PAST 0× = REVERSE, ONCE UNLOCKED)
//   VOLUME = A CANNON: AIM WITH THE MOUSE, HOLD TO CHARGE, LET GO TO FIRE. WHERE THE BALL LANDS ON THE 0–100 SCALE = VOLUME. WIND IS RANDOM
//   PLAY = HOLD TO WATCH (BUTTON OR SPACE; LET GO = PAUSE)
//   SEEK = A PENDULUM SWINGS OVER THE TIMELINE; STOP IT TO JUMP TO WHERE IT POINTS
//   BRIGHTNESS = THE VIDEO IS DARK; DRAG THE 🔦 ONTO IT AND LEAVE IT THERE. ITS BATTERY DRAINS: PUMP 🔋 TO KEEP IT LIT
//   FULLSCREEN = MAKES THE VIDEO SMALLER EVERY CLICK
// LOCKED FEATURES (FEATURES.EXE, UNLOCKED BY BEATING A CHALLENGE IN THAT WINDOW, REMEMBERED IN THIS BROWSER):
//   ◀◀ REVERSE (MAZE): CRANK COUNTER-CLOCKWISE PAST 0× AND HOLD-TO-WATCH PLAYS BACKWARDS, SOUND INCLUDED.
//   🔍 QUALITY ENHANCER (SUDOKU): THE VIDEO STARTS AS A POTATO. RUB IT (WIGGLE THE MOUSE OVER IT) TO SHARPEN IT, 7 LEVELS UP TO HD.
// ALWAYS AVAILABLE: 🎨 LOOKS: DOUBLE-CLICK THE VIDEO TO CYCLE DEEP FRIED / VHS / NIGHT VISION / 1-BIT / UNDERWATER / THERMAL.
// ⏮ PREVIOUS / NEXT ⏭: WIN A RANDOM MINIGAME IN FEATURES.EXE (RPS, COIN, HIGHER/LOWER, GUESS, REACTION) TO GO.
// ALWAYS AVAILABLE: ·−· MORSE CAPTIONS: RIGHT-CLICK THE VIDEO 3 TIMES. AUTO-GENERATED, RANDOM, NOBODY WILL CHECK.
// PLAIN <VIDEO>, SO IT WORKS FROM A DOUBLE-CLICKED FILE AND ON GITHUB PAGES ALIKE.
(() => {
  const id = new URLSearchParams(location.search).get('v')
  const v = (window.VIDEOS || []).find((x) => x.file === `videos/${id}.webm`) // ONLY FILES FROM OUR LIST
  const tick = () => (C.$('#clock').textContent = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }).toUpperCase())
  tick()
  setInterval(tick, 10000)

  document.addEventListener('click', (e) => { if (e.target.closest('.tb')) location.href = 'index.html' }) // ✕ = BACK

  if (!v) {
    C.$('#watch-title').textContent = '⚠️ VIDIOT.EXE — VIDEO NOT FOUND'
    C.$('#watch').innerHTML = '<p class="big">THIS VIDEO DOES NOT EXIST. NEITHER DOES THE QUEUE.</p>'
    return
  }
  C.addView(id) // A REAL VIEW: YOU OPENED IT
  document.title = `${v.title} — VIDIOT PLAYER`
  C.$('#watch-title').textContent = `📼 VIDIOT.EXE — NOW PLAYING: ${v.title}`
  C.$('#watch-stats').innerHTML = `<p class="status-bar-field">${C.viewsText(id, v.views, true)}</p>
    <p class="status-bar-field">RECORDED ${v.recorded} (${C.ago(v.recorded)})</p>
    <p class="status-bar-field">LENGTH ${C.fmtLength(v.seconds)}</p>`
  C.$('#watch').innerHTML = `<div class="watch-screen"><video id="vid" src="${v.file}" preload="auto" muted playsinline></video><canvas id="pix"></canvas><div id="dark"></div><div id="captions"></div></div>
    <p class="credit">📜 ${v.license.toUpperCase()} · ${v.author.toUpperCase()} ·
      <a href="${v.source}" target="_blank" rel="noopener">SOURCE: WIKIMEDIA COMMONS ↗</a></p>
    <p class="credit big" id="quality-label"></p>
    <div class="cursed-controls">
      <div class="crank-box">
        <svg id="crank" viewBox="0 0 100 100" aria-label="SPEED CRANK">
          <circle cx="50" cy="50" r="44" fill="#c0c0c0" stroke="#000" stroke-width="3"/>
          <circle cx="50" cy="50" r="6" fill="#000"/>
          <g id="crank-arm"><line x1="50" y1="50" x2="50" y2="14" stroke="#000" stroke-width="7" stroke-linecap="round"/>
            <circle cx="50" cy="14" r="10" fill="#c00000" stroke="#000" stroke-width="2"/></g>
        </svg>
        <div><div class="big" id="speed-label">SPEED: 1.00×</div><div class="hint">CLOCKWISE = FASTER. KEEP GOING BACK PAST 0 = REVERSE.</div></div>
      </div>
      <div class="cannon-box">
        <svg id="cannon" viewBox="0 0 600 145" aria-label="VOLUME CANNON">
          <line x1="80" y1="118" x2="580" y2="118" stroke="#000" stroke-width="3"/>
          <line x1="80" y1="118" x2="80" y2="130" stroke="#000" stroke-width="2"/><text x="80" y="141" class="tick">0</text><line x1="130" y1="118" x2="130" y2="126" stroke="#000" stroke-width="2"/><text x="130" y="141" class="tick">10</text><line x1="180" y1="118" x2="180" y2="126" stroke="#000" stroke-width="2"/><text x="180" y="141" class="tick">20</text><line x1="230" y1="118" x2="230" y2="126" stroke="#000" stroke-width="2"/><text x="230" y="141" class="tick">30</text><line x1="280" y1="118" x2="280" y2="126" stroke="#000" stroke-width="2"/><text x="280" y="141" class="tick">40</text><line x1="330" y1="118" x2="330" y2="130" stroke="#000" stroke-width="2"/><text x="330" y="141" class="tick">50</text><line x1="380" y1="118" x2="380" y2="126" stroke="#000" stroke-width="2"/><text x="380" y="141" class="tick">60</text><line x1="430" y1="118" x2="430" y2="126" stroke="#000" stroke-width="2"/><text x="430" y="141" class="tick">70</text><line x1="480" y1="118" x2="480" y2="126" stroke="#000" stroke-width="2"/><text x="480" y="141" class="tick">80</text><line x1="530" y1="118" x2="530" y2="126" stroke="#000" stroke-width="2"/><text x="530" y="141" class="tick">90</text><line x1="580" y1="118" x2="580" y2="130" stroke="#000" stroke-width="2"/><text x="580" y="141" class="tick">100</text>
          <polyline id="trail" fill="none" stroke="#000080" stroke-width="2" stroke-dasharray="3 5"/>
          <rect id="power-bg" x="6" y="4" width="70" height="8" fill="#fff" stroke="#000"/><rect id="power" x="6" y="4" width="0" height="8" fill="#c00000"/>
          <g id="barrel-group"><rect id="barrel" x="36" y="96" width="38" height="12" rx="3" fill="#333"/></g>
          <circle cx="40" cy="108" r="14" fill="#555" stroke="#000" stroke-width="2"/>
          <circle id="ball" r="6" fill="#000" visibility="hidden"/>
          <rect id="cannon-hit" x="0" y="80" width="80" height="45" fill="transparent"/>
        </svg>
        <div><span class="big" id="volume-label">VOLUME: 0%</span> <span class="hint" id="cannon-hint">AIM WITH THE MOUSE, HOLD TO CHARGE, LET GO TO FIRE.</span></div>
      </div>
    </div>
    <div class="cursed-controls">
      <div><button id="hold" class="big">▶ HOLD TO WATCH</button><div class="hint">OR HOLD SPACE. LET GO = PAUSE.</div></div>
      <div class="pendulum-box">
        <svg id="pendulum" viewBox="0 0 600 120" aria-label="PENDULUM SEEK">
          <line x1="20" y1="110" x2="580" y2="110" stroke="#000" stroke-width="6"/>
          <line id="played" x1="20" y1="110" x2="20" y2="110" stroke="#c00000" stroke-width="6"/>
          <line id="shadow" y1="16" y2="110" stroke="#000080" stroke-width="2" stroke-dasharray="4 4"/>
          <line id="rod" x1="300" y1="4" stroke="#444" stroke-width="3"/>
          <circle cx="300" cy="4" r="4" fill="#000"/>
          <circle id="bob" r="11" fill="#ffcc00" stroke="#000" stroke-width="2"/>
        </svg>
        <button id="stop-pendulum">⏱ STOP THE PENDULUM TO SEEK</button> <span id="seek-label" class="hint">THE PENDULUM DECIDES WHERE YOU GO.</span>
      </div>
      <div class="sun-box">
        <button id="pump" class="big">🔋 PUMP</button>
        <div><div class="big" id="bright-label">BATTERY: 100%</div><div class="hint">DRAG THE 🔦 ONTO THE VIDEO TO SEE IT. CLICK PUMP FAST TO CHARGE IT.</div></div>
      </div>
      <div><button id="ants">⛶ FULLSCREEN</button><div class="hint" id="ants-label">&nbsp;</div></div>
    </div>`

  // ---------- THE VIDEO: MUTED UNTIL YOU PULL THE ROPE; PLAYS ONLY WHILE YOU HOLD "HOLD TO WATCH" ----------
  const vid = C.$('#vid')
  let rate = 1, volume = 0
  const apply = () => {
    vid.playbackRate = Math.max(0.0625, Math.abs(rate)) // NEGATIVE = REVERSE, HANDLED BY HAND BELOW
    vid.volume = volume / 100
    vid.muted = volume === 0
    syncRev()
  }
  vid.addEventListener('click', () => C.status('CLICKING DOES NOTHING. HOLD THE BUTTON. COMMITMENT IS REQUIRED.'))
  C.watch = { get rate() { return rate }, get volume() { return volume }, vid } // READ BY TESTS

  // ---------- HOLD TO WATCH (DEAD MAN'S SWITCH): BUTTON OR SPACEBAR ----------
  const hold = C.$('#hold')
  let holding = false
  const play = () => {
    holding = true
    if (rate >= 0) vid.play().catch(() => {})
    else { revHint(); loadReverse().then(startRev) } // BACKWARDS SOUND (DECODED ONCE)
    hold.textContent = rate < 0 ? '◀◀ KEEP HOLDING…' : '⏸ KEEP HOLDING…'
  }
  const pause = () => { holding = false; vid.pause(); stopRev(); hold.textContent = rate < 0 ? '◀◀ HOLD TO UNWATCH' : '▶ HOLD TO WATCH' }
  hold.addEventListener('pointerdown', (e) => { e.preventDefault(); play() })
  addEventListener('pointerup', () => holding && pause())
  addEventListener('keydown', (e) => { if (e.code === 'Space') { e.preventDefault(); if (!e.repeat) play() } })
  addEventListener('keyup', (e) => { if (e.code === 'Space') { e.preventDefault(); pause() } })

  // ---------- PENDULUM SEEK: THE BOB'S SHADOW ON THE TIMELINE IS WHERE YOU JUMP WHEN YOU STOP IT ----------
  const AMP = 1.2, PERIOD = 2600, PIVOT = { x: 300, y: 4 }, ROD = 90 // RADIANS, MS, SVG UNITS
  let swingFrac = 0.5
  const swing = (now) => {
    const th = AMP * Math.sin((2 * Math.PI * now) / PERIOD)
    const bx = PIVOT.x + ROD * Math.sin(th), by = PIVOT.y + ROD * Math.cos(th)
    swingFrac = (Math.sin(th) / Math.sin(AMP) + 1) / 2 // -AMP..AMP → 0..1 ALONG THE WHOLE TIMELINE
    const sx = 20 + swingFrac * 560
    C.$('#rod').setAttribute('x2', bx); C.$('#rod').setAttribute('y2', by)
    C.$('#bob').setAttribute('cx', bx); C.$('#bob').setAttribute('cy', by)
    C.$('#shadow').setAttribute('x1', bx); C.$('#shadow').setAttribute('y1', by); C.$('#shadow').setAttribute('x2', sx)
    if (vid.duration) C.$('#played').setAttribute('x2', 20 + (vid.currentTime / vid.duration) * 560)
    requestAnimationFrame(swing)
  }
  requestAnimationFrame(swing)
  C.$('#stop-pendulum').addEventListener('click', () => {
    if (!vid.duration) return
    vid.currentTime = swingFrac * vid.duration
    C.$('#seek-label').textContent = `SEEKED TO ${C.fmt(vid.currentTime)}. THE PENDULUM HAS SPOKEN.`
  })
  C.watch.swingFrac = () => swingFrac // READ BY TESTS

  // ---------- BRIGHTNESS = A 🔦 YOU DRAG AROUND: THE VIDEO IS DARK EXCEPT A CIRCLE OF LIGHT AROUND THE TORCH ----------
  // DRAG IT ANYWHERE ON THE WINDOW AND LET GO: IT STAYS THERE. OFF THE VIDEO = THE VIDEO IS DARK.
  // THE CIRCLE'S SIZE IS THE BATTERY. IT DRAINS 3%/S; EVERY CLICK ON 🔋 PUMP ADDS 7%. EMPTY = PITCH BLACK.
  const screen = C.$('.watch-screen'), dark = C.$('#dark')
  const torch = Object.assign(document.createElement('div'), { id: 'torch', className: 'torch', textContent: '🔦' })
  torch.setAttribute('aria-label', 'FLASHLIGHT')
  document.body.append(torch)
  let battery = 100, torchX = 0, torchY = 0, grab = null
  const placeTorch = (x, y) => { // CLAMPED TO THE WINDOW SO IT CAN ALWAYS BE GRABBED AGAIN
    torchX = Math.max(20, Math.min(innerWidth - 20, x))
    torchY = Math.max(20, Math.min(innerHeight - 20, y))
    torch.style.transform = `translate(${torchX}px, ${torchY}px)`
  }
  { const r = screen.getBoundingClientRect(); placeTorch(r.left - 60, r.top + r.height / 2) } // STARTS LEFT OF THE VIDEO: DARK
  torch.addEventListener('pointerdown', (e) => {
    e.preventDefault()
    grab = { dx: e.clientX - torchX, dy: e.clientY - torchY }
    torch.setPointerCapture?.(e.pointerId)
    torch.classList.add('held')
  })
  addEventListener('pointermove', (e) => grab && placeTorch(e.clientX - grab.dx, e.clientY - grab.dy))
  addEventListener('pointerup', () => { grab = null; torch.classList.remove('held') })
  const aimLight = () => { // EVERY FRAME: THE LIGHT SITS WHERE THE TORCH IS, EVEN IF THE VIDEO MOVES OR SHRINKS
    const r = screen.getBoundingClientRect()
    dark.style.setProperty('--x', `${((torchX - r.left) / r.width) * 100}%`)
    dark.style.setProperty('--y', `${((torchY - r.top) / r.height) * 100}%`)
    requestAnimationFrame(aimLight)
  }
  requestAnimationFrame(aimLight)
  C.watch.torch = () => ({ x: torchX, y: torchY }) // READ BY TESTS
  const light = () => {
    dark.style.setProperty('--r', `${battery * 2.5}px`)
    C.$('#bright-label').textContent = battery > 0 ? `BATTERY: ${Math.round(battery)}%` : 'BATTERY: DEAD. PUMP!'
  }
  C.$('#pump').addEventListener('click', () => { battery = Math.min(100, battery + 7); C.beep(180 + battery * 3, 40); light() })
  setInterval(() => { battery = Math.max(0, battery - 0.3); light() }, 100)
  light()
  C.watch.battery = () => battery // READ BY TESTS

  // ---------- "FULLSCREEN": EVERY CLICK MAKES THE VIDEO SMALLER, UNTIL IT GIVES UP ----------
  let size = 1
  const ANTS = ['FULLSCREEN (FOR ANTS)', 'FULLSCREEN (FOR SMALLER ANTS)', 'FULLSCREEN (FOR AN ANT\'S PHONE)', 'FULLSCREEN (MICROSCOPE NOT INCLUDED)']
  C.$('#ants').addEventListener('click', () => {
    size = size * 0.7 < 0.2 ? 1 : size * 0.7
    C.$('.watch-screen').style.transform = `scale(${size})`
    C.$('#ants-label').textContent = size === 1 ? 'FINE. NORMAL SIZE.' : ANTS[Math.min(ANTS.length - 1, Math.round(Math.log(size) / Math.log(0.7)) - 1)]
  })

  // ---------- SPEED CRANK: ONE FULL TURN = 1× OF SPEED, A CLICK EVERY 0.25× ----------
  const MAX_RATE = 4
  let lockNag = 0
  const crank = C.$('#crank'), arm = C.$('#crank-arm')
  let cranking = false, lastA = 0, armDeg = 0
  const angle = (e) => { const r = crank.getBoundingClientRect(); return Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) }
  crank.addEventListener('pointerdown', (e) => { cranking = true; lastA = angle(e); e.preventDefault() })
  addEventListener('pointerup', () => (cranking = false))
  addEventListener('pointermove', (e) => {
    if (!cranking) return
    const a = angle(e)
    const d = Math.atan2(Math.sin(a - lastA), Math.cos(a - lastA)) // CLOCKWISE ON SCREEN = POSITIVE
    lastA = a
    armDeg += (d * 180) / Math.PI
    arm.setAttribute('transform', `rotate(${armDeg} 50 50)`)
    const before = Math.floor(rate * 4), wasReverse = rate < 0
    const min = unlocked('reverse') ? -MAX_RATE : 0.25 // REVERSE (BELOW 0) ONLY ONCE THE MAZE IS BEATEN
    const want = rate + d / (Math.PI * 2)
    if (want < min && min > 0 && performance.now() - lockNag > 2000) { lockNag = performance.now(); locked('reverse') }
    rate = Math.max(min, Math.min(MAX_RATE, want))
    if (Math.floor(rate * 4) !== before) C.beep(200 + Math.abs(rate) * 150, 30) // A CLICK EVERY 0.25×
    C.$('#speed-label').textContent = rate < 0 ? `SPEED: ${rate.toFixed(2)}× ◀◀` : `SPEED: ${rate.toFixed(2)}×`
    if (holding && wasReverse !== rate < 0) { pause(); play() } // CROSSED 0 WHILE WATCHING: SWITCH DIRECTION
    apply()
  })

  // ---------- VOLUME CANNON: HOLD TO CHARGE (POWER BOUNCES UP AND DOWN), LET GO TO FIRE ----------
  // THE BARREL POINTS AT THE MOUSE (5°–85°). THE BALL FLIES IN A PARABOLA (GRAVITY + WIND) AND WHERE IT LANDS ON
  // THE 0–100 SCALE IS THE VOLUME. THE WIND IS RANDOM EVERY SHOT, SO AIMING IS NEVER QUITE ENOUGH.
  const GROUND = 118, SCALE0 = 80, SCALE1 = 580, MUZZLE = { x: 40, y: 108 }, G = 400, VMAX = 520
  let charging = false, flying = false, power = 0, chargeStart = 0, shotAngle = 45, wind = 0, landing = null
  const cannonSvg = C.$('#cannon')
  const hint = () => (C.$('#cannon-hint').textContent = `ANGLE ${Math.round(shotAngle)}° · WIND ${wind < 0 ? '←' : '→'} ${Math.abs(wind)} · AIM WITH THE MOUSE, HOLD TO CHARGE, LET GO TO FIRE.`)
  const point = (deg) => { // TURN THE BARREL
    shotAngle = Math.max(5, Math.min(85, deg))
    C.$('#barrel-group').setAttribute('transform', `rotate(${-shotAngle} ${MUZZLE.x} ${MUZZLE.y})`)
    hint()
  }
  // AIM: THE ANGLE FROM THE MUZZLE TO THE MOUSE (SVG UNITS), WHILE HOVERING THE CANNON BOX OR WHILE CHARGING
  const aimAt = (e) => {
    const r = cannonSvg.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width) * 600, y = ((e.clientY - r.top) / r.height) * 145
    point((Math.atan2(MUZZLE.y - y, x - MUZZLE.x) * 180) / Math.PI)
  }
  addEventListener('pointermove', (e) => { if (!flying && (charging || e.target.closest?.('#cannon'))) aimAt(e) })
  const aim = () => { wind = Math.round(Math.random() * 120 - 60); point(shotAngle) } // NEW RANDOM WIND (−60…+60) FOR THE NEXT SHOT
  const charge = (now) => {
    if (!charging) return
    power = 1 - Math.abs((((now - chargeStart) / 800) % 2) - 1) // PING-PONGS 0 → 1 → 0 EVERY 1.6 S
    C.$('#power').setAttribute('width', power * 70)
    requestAnimationFrame(charge)
  }
  cannonSvg.addEventListener('pointerdown', (e) => { // PRESS ANYWHERE ON THE CANNON BOX: AIM AT THE MOUSE AND CHARGE
    e.preventDefault()
    if (flying) return C.status('💥 THE BALL IS STILL IN THE AIR. PATIENCE.')
    aimAt(e)
    charging = true
    chargeStart = performance.now()
    requestAnimationFrame(charge)
  })
  const fire = () => {
    charging = false
    flying = true
    const v0 = power * VMAX, rad = (shotAngle * Math.PI) / 180
    let x = MUZZLE.x, y = MUZZLE.y, vx = v0 * Math.cos(rad), vy = -v0 * Math.sin(rad), last = performance.now()
    const trail = [[x, y]], ball = C.$('#ball')
    ball.setAttribute('visibility', 'visible')
    C.beep(90, 200)
    const step = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000) * 1.5 // A BIT FASTER THAN REAL TIME, NOBODY LIKES WAITING
      last = now
      vx += wind * dt
      vy += G * dt
      x += vx * dt
      y += vy * dt
      trail.push([x, y])
      ball.setAttribute('cx', x); ball.setAttribute('cy', Math.min(y, GROUND))
      C.$('#trail').setAttribute('points', trail.map((p) => p.join(',')).join(' '))
      if (y < GROUND || vy < 0) return requestAnimationFrame(step)
      // LANDED: THE SCALE RUNS 0 (X=80) TO 100 (X=580). MISSING THE SCALE (SHORT OR LONG) CHANGES NOTHING.
      landing = x
      if (x < SCALE0 || x > SCALE1) {
        C.status(x < SCALE0 ? `💥 TOO SHORT. MISSED THE SCALE. VOLUME STAYS ${volume}%.` : `💥 OVERSHOT. MISSED THE SCALE. VOLUME STAYS ${volume}%.`)
        C.beep(70, 250)
      } else {
        volume = Math.round(((x - SCALE0) / (SCALE1 - SCALE0)) * 100)
        C.$('#volume-label').textContent = `VOLUME: ${volume}%`
        C.status(`💥 LANDED ON ${volume}. VOLUME: ${volume}%.`)
        C.beep(60 + volume * 4, 120)
        apply()
      }
      flying = false
      power = 0
      C.$('#power').setAttribute('width', 0)
      aim()
    }
    requestAnimationFrame(step)
  }
  addEventListener('pointerup', () => charging && fire())
  aim()
  C.watch.cannon = () => ({ flying, landing, angle: shotAngle, wind }) // READ BY TESTS

  // ---------- FEATURES.EXE: EACH FEATURE IS LOCKED UNTIL YOU BEAT ITS CHALLENGE IN THIS WINDOW ----------
  const FEATURES = [
    { key: 'reverse', name: '◀◀ REVERSE', challenge: 'maze', how: 'CRANK COUNTER-CLOCKWISE PAST 0× TO PLAY BACKWARDS.' },
    { key: 'enhance', name: '🔍 QUALITY ENHANCER', challenge: 'sudoku', how: 'RUB THE VIDEO (WIGGLE THE MOUSE OVER IT) TO SHARPEN IT. STOP AND IT GETS BLURRY AGAIN.' },
  ]
  const unlocked = (k) => { try { return localStorage.getItem('unlocked:' + k) === '1' } catch { return false } }
  const unlock = (k) => { try { localStorage.setItem('unlocked:' + k, '1') } catch { /* JUST THIS VISIT, THEN */ } }
  const panel = C.$('#features'), panelTitle = C.$('#features-title')
  const list = () => {
    panelTitle.textContent = '🔒 FEATURES.EXE'
    panel.innerHTML = FEATURES.map((f) => unlocked(f.key)
      ? '<div class="feature open"><b>' + f.name + '</b> ✅<div class="hint">' + f.how + '</div></div>'
      : '<div class="feature"><b>' + f.name + '</b> 🔒<div class="hint">BEAT THE ' + f.challenge.toUpperCase() + ' TO UNLOCK.</div>'
        + '<button data-unlock="' + f.key + '">UNLOCK</button></div>').join('')
  }
  panel.addEventListener('click', (e) => {
    const k = e.target.dataset?.unlock
    if (!k) return
    const f = FEATURES.find((x) => x.key === k)
    const host = {
      win: panel, titleEl: panelTitle, name: 'FEATURES.EXE', icon: '🔒', heading: 'FEATURE LOCKED',
      pool: [C.interrupts[f.challenge]],
      onWin: () => { unlock(k); list(); C.status(f.name + ' UNLOCKED. ' + f.how) },
      onLose: () => C.runChallenge(host), // LOST? AGAIN.
    }
    C.runChallenge(host)
  })
  const locked = (k) => { if (unlocked(k)) return false; C.status('🔒 ' + FEATURES.find((f) => f.key === k).name + ' IS LOCKED. UNLOCK IT IN FEATURES.EXE →'); return true }
  list()
  // ---------- ⏮ PREVIOUS / NEXT ⏭: WIN A MINIGAME IN THIS WINDOW TO GO THERE. LOSE = ANOTHER GAME ----------
  const ALL = window.VIDEOS, here = ALL.indexOf(v)
  let travelling = false
  const go = (step) => {
    if (travelling) return C.status('🎮 FINISH THE GAME FIRST.')
    travelling = true
    const to = ALL[(here + step + ALL.length) % ALL.length]
    const host = {
      win: panel, titleEl: panelTitle, name: step > 0 ? 'NEXT VIDEO.EXE' : 'PREVIOUS VIDEO.EXE', icon: '🎮',
      heading: step > 0 ? 'WIN TO SEE THE NEXT VIDEO' : 'WIN TO GO BACK A VIDEO', noPenalty: true,
      pool: ['rps', 'coin', 'higherLower', 'guess', 'reaction'].map((k) => C.interrupts[k]),
      onWin: () => {
        panelTitle.textContent = '⏳ PLEASE WAIT.EXE' // MANDATORY FUN: LOADING SCREEN IN THIS PANEL (JS/FUN.JS), THEN GO
        C.loading(panel, undefined, () => (location.href = 'watch.html?v=' + to.file.replace(/^videos\/|\.webm$/g, '')))
      },
      onLose: () => { C.status('🎮 LOST. HERE IS ANOTHER GAME.'); C.runChallenge(host) },
    }
    C.runChallenge(host)
  }
  C.$('#next').addEventListener('click', () => go(1))
  C.$('#prev').addEventListener('click', () => go(-1))
  C.watch.unlockAll = () => { FEATURES.forEach((f) => unlock(f.key)); list() } // USED BY TESTS

  // ---------- ◀◀ REVERSE: CRANK BELOW 0 WHILE HOLDING TO WATCH = TIME RUNS BACKWARDS, SOUND TOO ----------
  // THE PICTURE: STEP CURRENTTIME BACKWARDS EVERY FRAME. THE SOUND: DECODE THE CLIP'S AUDIO ONCE, FLIP IT, AND PLAY
  // THE FLIPPED COPY FROM THE MATCHING SPOT AT THE CRANK'S SPEED AND THE CANNON'S VOLUME.
  // A DOUBLE-CLICKED FILE (FILE://) CANNOT BE READ AS BYTES, SO THERE (AND WHILE THE DECODE IS STILL RUNNING) THE VIDEO
  // ITSELF PLAYS SHORT FORWARD CHUNKS IN BACKWARDS ORDER WITH ITS OWN SOUND: A GARBLED, STEPPED "CHUNKED REVERSE".
  const CHUNK = 0.25 // SECONDS OF VIDEO PER FORWARD CHUNK
  let lastT = performance.now(), revBuf = null, revLoading = null, revSrc = null, revGain = null, chunkEnd = 0
  const loadReverse = () => (revLoading ??= (location.protocol === 'file:' ? Promise.reject(new Error('FILE://')) : fetch(v.file))
    .then((r) => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.arrayBuffer() })
    .then((bytes) => C.audio().decodeAudioData(bytes))
    .then((buf) => {
      const out = C.audio().createBuffer(buf.numberOfChannels, buf.length, buf.sampleRate)
      for (let c = 0; c < buf.numberOfChannels; c++) {
        const src = buf.getChannelData(c), dst = out.getChannelData(c), n = src.length
        for (let i = 0; i < n; i++) dst[i] = src[n - 1 - i]
      }
      revBuf = out
      startRev() // DECODE FINISHED MID-HOLD: SWAP THE CHUNKS FOR THE SMOOTH FLIPPED SOUND
    })
    .catch(() => { revBuf = false; if (holding) revHint() })) // STAY ON CHUNKED REVERSE FOR GOOD
  const revHint = () => {
    const msg = (revBuf !== false ? '' : location.protocol === 'file:' ? '' : ' THIS CLIP HAS NO SOUND TRACK TO FLIP.') +
      (volume === 0 ? ' VOLUME IS 0, SO YOU HEAR NOTHING. FIRE THE VOLUME CANNON.' : '')
    if (msg) C.status('◀◀' + msg)
  }
  const stopRev = () => { try { revSrc?.stop() } catch { /* ALREADY STOPPED */ } revSrc = null }
  const startRev = () => {
    stopRev()
    if (!revBuf || !holding || rate >= 0) return
    const a = C.audio()
    a.resume() // A CONTEXT MADE BEFORE ANY CLICK STARTS SUSPENDED (SILENT) UNTIL RESUMED
    if (!revGain) { revGain = a.createGain(); revGain.connect(a.destination) }
    revGain.gain.value = volume / 100
    revSrc = a.createBufferSource()
    revSrc.buffer = revBuf
    revSrc.playbackRate.value = Math.abs(rate)
    revSrc.connect(revGain)
    revSrc.start(0, Math.max(0, Math.min(revBuf.duration - 0.01, revBuf.duration - vid.currentTime))) // FLIPPED: T SECONDS IN = DURATION − T
  }
  const syncRev = () => { // CRANK OR CANNON CHANGED WHILE REWINDING: FOLLOW ALONG
    if (revGain) revGain.gain.value = volume / 100
    if (revSrc) revSrc.playbackRate.value = Math.max(0.0625, Math.abs(rate))
    if (rate < 0) loadReverse() // CRANKED INTO REVERSE: START DECODING NOW, NOT ON THE FIRST HOLD
  }
  if (unlocked('reverse')) loadReverse() // ALREADY UNLOCKED: DECODE WHILE THE PAGE LOADS
  const rewind = (now) => {
    const dt = (now - lastT) / 1000
    lastT = now
    if (rate < 0 && holding && vid.duration && !revBuf) { // CHUNKED REVERSE: PLAY 0.25 S FORWARD, THEN JUMP TO THE CHUNK BEFORE IT
      if (vid.paused || vid.currentTime >= chunkEnd || vid.currentTime < chunkEnd - CHUNK - 0.1) {
        let s = (vid.paused ? vid.currentTime : chunkEnd - CHUNK) - CHUNK
        if (s <= 0) s = vid.duration - CHUNK // FELL OFF THE START: WRAP TO THE END
        vid.currentTime = s
        chunkEnd = s + CHUNK
        vid.play().catch(() => {})
      }
    } else if (rate < 0 && holding && vid.duration) {
      vid.pause()
      let t = vid.currentTime + dt * rate // RATE IS NEGATIVE
      if (t <= 0) { t = vid.duration - 0.05; vid.currentTime = t; startRev() } // FELL OFF THE START: WRAP TO THE END, SOUND TOO
      else vid.currentTime = t
    }
    requestAnimationFrame(rewind)
  }
  requestAnimationFrame(rewind)
  C.watch.reverse = () => rate < 0 // READ BY TESTS
  C.watch.reverseAudio = () => ({ ready: !!revBuf, failed: revBuf === false, playing: !!revSrc, duration: revBuf ? revBuf.duration : 0, chunked: rate < 0 && holding && !revBuf && !vid.paused, gain: revGain ? revGain.gain.value : 0, ctx: revGain ? revGain.context.state : '' }) // READ BY TESTS

// ---------- 🎨 LOOKS (FREE, NO UNLOCK): DOUBLE-CLICK THE VIDEO TO CYCLE THROUGH CURSED "QUALITY" PRESETS ----------
  const LOOKS = [
    ['NORMAL', ''],
    ['DEEP FRIED', 'saturate(4) contrast(2.2) brightness(1.1) hue-rotate(-12deg)'],
    ['VHS', 'contrast(1.3) saturate(1.7) sepia(0.35) blur(0.7px)'],
    ['NIGHT VISION', 'grayscale(1) sepia(1) hue-rotate(60deg) saturate(6) brightness(1.2)'],
    ['1-BIT CALCULATOR', 'grayscale(1) contrast(30)'],
    ['UNDERWATER', 'hue-rotate(160deg) saturate(1.6) blur(1.5px)'],
    ['THERMAL', 'invert(1) hue-rotate(180deg) saturate(3)'],
  ]
  let look = 0
  vid.parentElement.addEventListener('dblclick', (e) => {
    e.preventDefault()
    look = (look + 1) % LOOKS.length
    vid.style.filter = pix.style.filter = LOOKS[look][1]
    C.status(`🎨 LOOK: ${LOOKS[look][0]}. DOUBLE-CLICK AGAIN FOR THE NEXT ONE.`)
    meter()
  })
  C.watch.look = () => LOOKS[look][0] // READ BY TESTS

  // ---------- 🔍 QUALITY ENHANCER: THE VIDEO STARTS AS A POTATO. RUB IT (FAST LEFT-RIGHT WIGGLES) TO SHARPEN ----------
  // EACH RUB = ONE LEVEL SHARPER (ONCE UNLOCKED). 10S WITHOUT RUBBING = ONE LEVEL BLURRIER AGAIN.
  const LEVELS = [0, 240, 144, 96, 64, 40, 24, 12] // WIDTH THE PICTURE IS SQUASHED TO (0 = ORIGINAL)
  const LABELS = ['HD (YOU EARNED IT)', '480P (ALLEGEDLY)', '360P', '240P', '144P', 'POTATO', 'SMALL POTATO', 'MINECRAFT']
  const WORST = LEVELS.length - 1, START = WORST - 1 // STARTS AT SMALL POTATO; LEAVE IT ALONE AND IT ROTS TO MINECRAFT
  const pix = C.$('#pix'), pctx = pix.getContext('2d')
  let level = START, flips = [], lastDir = 0, lastRub = performance.now(), lastX = null, legStart = 0
  const meter = () => {
    const bar = '▓'.repeat(flips.length) + '░'.repeat(Math.max(0, 4 - flips.length))
    C.$('#quality-label').textContent = `🔍 QUALITY: ${LABELS[level]}${look ? ` · ${LOOKS[look][0]}` : ''}${level ? ` · RUB: ${bar}` : ''}${level && !unlocked('enhance') ? ' · 🔒 UNLOCK IT IN FEATURES.EXE' : ''}`
  }
  const setLevel = (n, say = true) => {
    level = Math.max(0, Math.min(WORST, n))
    pix.style.display = level ? 'block' : 'none'
    if (say) C.status('🔍 QUALITY: ' + LABELS[level] + (level ? '. KEEP RUBBING.' : '.'))
    meter()
  }
  // A RUB = 4 LEFT/RIGHT DIRECTION CHANGES WITHIN 1.5 S, EACH STROKE AT LEAST 25 PX LONG (WHOLE STROKES, NOT
  // SINGLE MOUSE EVENTS: A NORMAL WIGGLE SENDS MANY TINY EVENTS)
  screen.addEventListener('pointermove', (e) => {
    const now = performance.now()
    if (lastX === null) { lastX = legStart = e.clientX; return }
    const dir = Math.sign(e.clientX - lastX)
    lastX = e.clientX
    if (!dir) return
    if (dir !== lastDir) {
      if (Math.abs(e.clientX - legStart) >= 25 || lastDir === 0) flips = flips.filter((t) => now - t < 1500).concat(now)
      lastDir = dir
      legStart = e.clientX
      meter()
    }
    if (flips.length < 4) return
    flips = []
    meter()
    if (locked('enhance')) return
    lastRub = now
    setLevel(level - 1)
  })
  screen.addEventListener('pointerleave', () => { lastX = null; lastDir = 0 })
  setInterval(() => { if (level < WORST && performance.now() - lastRub > 10000) { lastRub = performance.now(); setLevel(level + 1) } }, 500)
  const drawPix = () => {
    if (level && vid.videoWidth) {
      const w = LEVELS[level], h = Math.max(1, Math.round((w * vid.videoHeight) / vid.videoWidth))
      if (pix.width !== w) { pix.width = w; pix.height = h }
      pctx.imageSmoothingEnabled = false
      pctx.drawImage(vid, 0, 0, w, h)
    }
    requestAnimationFrame(drawPix)
  }
  requestAnimationFrame(drawPix)
  setLevel(START, false)
  setInterval(() => { if (flips.length && performance.now() - flips[flips.length - 1] > 1500) { flips = []; meter() } }, 300)
  C.watch.quality = () => level // READ BY TESTS
  C.watch.rub = () => { lastRub = performance.now(); setLevel(level - 1) } // USED BY TESTS (RUBBING A HEADLESS MOUSE IS FLAKY)

  // ---------- ·−· MORSE CAPTIONS (NO UNLOCK NEEDED): RIGHT-CLICK THE VIDEO 3 TIMES. RANDOM WORDS, AUTO-"TRANSLATED". NOBODY CHECKS ----------
  const MORSE = { A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....', I: '..', J: '.---', K: '-.-', L: '.-..', M: '--',
    N: '-.', O: '---', P: '.--.', Q: '--.-', R: '.-.', S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-', Y: '-.--', Z: '--..' }
  const WORDS = ['DUCK', 'HELP', 'WHY', 'LOADING', 'SKIP', 'NO', 'BUFFER', 'HMM', 'OK', 'PAINT', 'WOW', 'AD', 'BRB', 'SEND', 'SNACKS']
  const caps = C.$('#captions')
  let capsOn = false, rclicks = []
  const toMorse = (w) => [...w].map((ch) => MORSE[ch]).join(' ').replaceAll('-', '−')
  vid.parentElement.addEventListener('contextmenu', (e) => {
    e.preventDefault()
    rclicks = rclicks.filter((t) => e.timeStamp - t < 1500).concat(e.timeStamp)
    if (rclicks.length < 3) return
    rclicks = []
    capsOn = !capsOn
    caps.style.display = capsOn ? 'block' : 'none'
    C.status(capsOn ? '·−· CAPTIONS ON (AUTO-GENERATED, 100% ACCURATE, TRUST US).' : 'CAPTIONS OFF.')
  })
  setInterval(() => {
    if (!capsOn) return
    const line = [C.pick(WORDS), C.pick(WORDS)].map(toMorse).join('   /   ')
    caps.textContent = '[AUTO] ' + line
  }, 1800)
  C.watch.captions = () => capsOn // READ BY TESTS
})()
