// THE LIVING CURSOR. A PAGE CANNOT CHANGE REAL MOUSE SPEED, SO WHILE POINTER-LOCKED WE HIDE THE
// REAL CURSOR, READ RAW MOVEMENT, MOVE AN EMOJI CURSOR OURSELVES, AND RE-DISPATCH POINTER/MOUSE
// EVENTS AT THE EMOJI'S POSITION. WIDGETS JUST LISTEN TO NORMAL EVENTS, SO THEY WORK WITH BOTH
// THE CURSED CURSOR AND THE REAL ONE (CALM MODE / ESC).
//   🐌 SLOW · 🚀 GUIDED ROCKET: ALWAYS FLYING, THE MOUSE ONLY STEERS · 🍺 NORMAL, BUT MOVE TOO FAST AND
//   YOU'RE STUNNED · 🧲 PULLED TOWARD A WANDERING METAL EMOJI
//   WHILE A MAZE/CAPTCHA IS OPEN (C.BLOCKED) THE CURSOR IS A PLAIN 1:1 ARROW AND THE CYCLE PAUSES.
(() => {
  const lock = C.$('#lock'), el = C.$('#cursor'), hud = C.$('#cursor-hud'), bait = C.$('#magnet-target')
  const MODES = ['🐌', '🚀', '🍺', '🧲']
  const SPEED = { '🐌': 0.1, '🍺': 1, '🧲': 1, DEFAULT: 1 }
  const ARROW = '<svg width="20" height="31" viewBox="0 0 12 19"><path d="M.5.5v15.5l3.8-3.7 2.9 6.3 2.2-1-2.9-6.2h5.3z" fill="#fff" stroke="#000"/></svg>'
  const BAIT_SPEED = 150 // PX/S
  const baitVel = { x: 0, y: 0 }
  let glyph = ''
  const CYCLE_MS = 10000, STUN_MS = 1500, TOO_FAST = 40 // PX PER MOUSE EVENT
  const ROCKET_SPEED = 320, ROCKET_TURN = 4 // PX/S, RAD/S
  let heading = -Math.PI / 2, steer = heading, lastFrame = performance.now()
  const BAITS = ['🔩', '📎', '🪙', '🔧', '🧷']
  const pos = C.cursor, target = { x: 0, y: 0 }
  let mode = 0, modeStart = performance.now(), stunnedUntil = 0, pressed = null, hovered = null, lastShown = { x: -1, y: -1 }

  // C.CONFINE = { LEFT, TOP, RIGHT, BOTTOM } TRAPS THE CURSOR IN A BOX (THE MAZE); NULL = WHOLE SCREEN
  const clamp = () => {
    const b = C.confine || { left: 0, top: 0, right: innerWidth, bottom: innerHeight }
    pos.x = Math.max(b.left, Math.min(b.right - 1, pos.x))
    pos.y = Math.max(b.top, Math.min(b.bottom - 1, pos.y))
  }
  C.cursorTo = (x, y) => { pos.x = x; pos.y = y; clamp() } // FORCE-MOVE THE CURSOR
  const stunned = () => performance.now() < stunnedUntil
  const current = () => (C.blocked ? 'DEFAULT' : MODES[mode]) // MAZE/CAPTCHA GET A NORMAL CURSOR
  C.cursorPoint = () => ({ x: pos.x, y: pos.y })
  const under = (p) => document.elementFromPoint(Math.max(0, Math.min(innerWidth - 1, p.x)), Math.max(0, Math.min(innerHeight - 1, p.y)))
  const fire = (type, target, p) => target?.dispatchEvent(new (type.startsWith('pointer') ? PointerEvent : MouseEvent)(type, {
    bubbles: true, cancelable: true, composed: true, view: window, clientX: p.x, clientY: p.y,
    pointerId: 1, pointerType: 'mouse', isPrimary: true, button: 0, buttons: pressed ? 1 : 0,
  }))

  C.cursorMode = (i) => { // ALSO USED BY TESTS
    mode = i
    modeStart = performance.now()
    stunnedUntil = 0
    heading = steer = -Math.PI / 2 // ROCKETS LAUNCH UPWARD
    if (MODES[mode] === '🧲') { // DROP THE BAIT SOMEWHERE ON SCREEN, AWAY FROM THE EDGES
      target.x = C.rand(80, innerWidth - 80)
      target.y = C.rand(80, innerHeight - 80)
      bait.textContent = C.pick(BAITS)
      const a = C.rand(0, Math.PI * 2)
      baitVel.x = Math.cos(a) * BAIT_SPEED
      baitVel.y = Math.sin(a) * BAIT_SPEED
    }
  }
  C.magnetTarget = () => ({ ...target })
  C.cursorMove = (dx, dy) => {
    const m = current()
    if (stunned() && m !== 'DEFAULT') return
    if (m === '🚀') { if (Math.hypot(dx, dy) > 0.5) steer = Math.atan2(dy, dx); return } // MOUSE SETS DIRECTION ONLY
    if (m === '🍺' && Math.hypot(dx, dy) > TOO_FAST) {
      stunnedUntil = performance.now() + STUN_MS
      C.status('🍺 EASY THERE. CURSOR STUNNED.')
      return
    }
    pos.x += dx * SPEED[m]
    pos.y += dy * SPEED[m]
    clamp()
  }
  C.cursorDown = () => {
    if (stunned() && !C.blocked) return
    const p = C.cursorPoint()
    pressed = under(p)
    fire('pointerdown', pressed, p)
    fire('mousedown', pressed, p)
  }
  C.cursorUp = () => {
    const p = C.cursorPoint(), t = under(p), was = pressed
    if (!was) return
    fire('pointerup', was, p)
    fire('mouseup', was, p)
    pressed = null
    if (t && (was === t || was.contains(t))) fire('click', t, p)
  }

  // WHILE LOCKED, REAL EVENTS LAND ON #LOCK: TRANSLATE THEM AND STOP THEM REACHING ANY WIDGET.
  const swallow = (e) => { if (C.locked) e.stopPropagation() }
  ;['pointerdown', 'pointerup', 'pointermove', 'click', 'mouseover', 'mouseout', 'contextmenu', 'dblclick'].forEach((t) => lock.addEventListener(t, swallow))
  lock.addEventListener('mousemove', (e) => { if (C.locked) { e.stopPropagation(); C.cursorMove(e.movementX, e.movementY) } })
  lock.addEventListener('mousedown', (e) => { if (C.locked) { e.stopPropagation(); if (e.button === 0) C.cursorDown() } })
  lock.addEventListener('mouseup', (e) => { if (C.locked) { e.stopPropagation(); if (e.button === 0) C.cursorUp() } })
  addEventListener('mousemove', (e) => { if (!C.locked && e.isTrusted) { pos.x = e.clientX; pos.y = e.clientY } })

  // ONE BUTTON IN THE VIDIOT CURSOR.EXE WINDOW: ENABLE (FIRST TIME), RESTORE (AFTER ESC), DISABLED WHILE ON.
  // ITS SIZE NEVER CHANGES, SO THE PAGE NEVER SHIFTS UNDER A TRAPPED CURSOR.
  const syncRelock = () => {
    const b = C.$('#start-btn')
    b.disabled = C.locked || C.calm
    b.textContent = !C.started ? '▶ CLICK HERE TO ENABLE THE VIDIOT CURSOR'
      : C.calm ? 'CALM MODE: NORMAL CURSOR' : C.locked ? '✔ VIDIOT CURSOR ENABLED' : '🔒 RESTORE YOUR CURSOR EXPERIENCE'
  }
  C.syncCursorButton = syncRelock
  document.addEventListener('pointerlockchange', () => {
    C.locked = document.pointerLockElement === lock
    document.body.classList.toggle('locked', C.locked)
    syncRelock()
    if (!C.locked && hovered) { hovered.dispatchEvent(new Event('fakeleave')); hovered = null }
  })
  C.requestLock = () => {
    if (C.calm) return
    const refused = () => C.status('YOUR BROWSER REFUSED THE CURSED CURSOR. LUCKY YOU.')
    try { lock.requestPointerLock()?.catch?.(refused) } catch { refused() }
  }
  C.onCalm.push(syncRelock)
  C.$('#start-btn').addEventListener('click', () => { C.started = true; syncRelock(); C.requestLock() })

  const frame = (now) => {
    if (C.blocked) { modeStart += now - lastFrame; stunnedUntil += now - lastFrame } // PAUSE THE CYCLE DURING A MAZE/CAPTCHA
    if (now - modeStart >= CYCLE_MS) C.cursorMode((mode + 1) % MODES.length)
    const m = current()
    const dt = Math.min(0.05, (now - lastFrame) / 1000)
    lastFrame = now
    if (m === '🧲') {
      // THE BAIT WANDERS: DRIFT, TURN A LITTLE AT RANDOM, AND STAY 60PX AWAY FROM THE EDGES
      const turn = C.rand(-1.5, 1.5) * dt, c = Math.cos(turn), s = Math.sin(turn)
      ;[baitVel.x, baitVel.y] = [baitVel.x * c - baitVel.y * s, baitVel.x * s + baitVel.y * c]
      target.x += baitVel.x * dt
      target.y += baitVel.y * dt
      if (target.x < 60 || target.x > innerWidth - 60) { baitVel.x *= -1; target.x = Math.max(60, Math.min(innerWidth - 60, target.x)) }
      if (target.y < 60 || target.y > innerHeight - 60) { baitVel.y *= -1; target.y = Math.max(60, Math.min(innerHeight - 60, target.y)) }
      bait.style.transform = `translate(${target.x}px, ${target.y}px)`
    }
    if (m === '🧲' && C.locked && !stunned()) {
      pos.x += (target.x - pos.x) * 0.02
      pos.y += (target.y - pos.y) * 0.02
    }
    if (m === '🚀' && C.locked) {
      // TURN TOWARD THE STEERING DIRECTION AT A LIMITED RATE, THEN ALWAYS FLY FORWARD
      let diff = steer - heading
      diff = Math.atan2(Math.sin(diff), Math.cos(diff))
      heading += Math.sign(diff) * Math.min(Math.abs(diff), ROCKET_TURN * dt)
      pos.x += Math.cos(heading) * ROCKET_SPEED * dt
      pos.y += Math.sin(heading) * ROCKET_SPEED * dt
      // FLY OFF ONE EDGE, COME BACK FROM THE OPPOSITE ONE
      pos.x = (pos.x + innerWidth) % innerWidth
      pos.y = (pos.y + innerHeight) % innerHeight
    }
    clamp()

    const p = C.cursorPoint()
    // OVER ANY VIDEO PLAYER THE EMOJI CURSOR IS A DUCK (IT KEEPS THE CURRENT MODE'S MOVEMENT)
    const overPlayer = m !== 'DEFAULT' && !!under(p)?.closest('.screen, .watch-screen')
    const g = m === 'DEFAULT' ? ARROW : stunned() ? '😵‍💫' : overPlayer ? '🦆' : m
    if (g !== glyph) { glyph = g; el.innerHTML = g; el.classList.toggle('arrow', m === 'DEFAULT') }
    // 🚀 IS DRAWN POINTING UP-RIGHT (-45°): ROTATE IT TO FACE THE HEADING.
    // 🧲 (WINDOWS EMOJI) HAS ITS POLES POINTING DOWN (+90°): ROTATE THE POLES TO FACE THE BAIT.
    const spin = overPlayer ? 0 : m === '🚀' ? heading + Math.PI / 4 // THE DUCK STAYS UPRIGHT
      : m === '🧲' ? Math.atan2(target.y - p.y, target.x - p.x) - Math.PI / 2 : 0
    el.style.transform = `translate(${p.x}px, ${p.y}px) rotate(${spin}rad)`
    bait.style.display = m === '🧲' && C.locked ? 'block' : 'none'
    hud.textContent = !C.locked ? 'CURSOR: YOUR BORING NORMAL ONE' : m === 'DEFAULT' ? 'CURSOR: NORMAL (MAZE TIME)'
      : `CURSOR: ${m} · NEXT IN ${Math.ceil((CYCLE_MS - (now - modeStart)) / 1000)}S: ${MODES[(mode + 1) % MODES.length]}`
    if (C.locked && (Math.abs(p.x - lastShown.x) > 0.5 || Math.abs(p.y - lastShown.y) > 0.5)) {
      lastShown = p
      fire('pointermove', pressed || under(p), p)
      const h = under(p)?.closest('[data-hover]') ?? null
      if (h !== hovered) { hovered?.dispatchEvent(new Event('fakeleave')); h?.dispatchEvent(new Event('fakeenter')); hovered = h }
    }
    requestAnimationFrame(frame)
  }
  C.cursorMode(0)
  requestAnimationFrame(frame)
})()
