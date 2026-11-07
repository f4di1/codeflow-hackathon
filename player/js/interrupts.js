// CHALLENGES (MAZE, CAPTCHA, XO, SUDOKU) THAT UNLOCK FEATURES. NOTHING APPEARS ON ITS OWN: A CHALLENGE ONLY RUNS
// WHEN YOU ASK FOR IT, INSIDE THE WINDOW YOU ASKED FROM. C.RUNCHALLENGE(HOST) RUNS ONE.
// A HOST = { WIN, TITLEEL, NAME, ICON, HEADING, POOL, ONWIN(MSG), ONLOSE() }. FAILING = CHIPS PENALTY.
// THE MAZE CANNOT BE FAILED, ONLY BEATEN.
(() => {
  let current = null, host = null // CURRENT = THE CHALLENGE ON SCREEN, IF ANY

  const interrupt = (html, title) => {
    if (current) { current.done = true; current.cleanup?.() } // NEVER TWO CHALLENGES AT ONCE
    host.titleEl.textContent = `${host.icon} ${title.replace('AD BLOCKER.EXE', host.name)}`
    host.win.innerHTML = `<div class="challenge">${html.replaceAll('AD BLOCKER DETECTED', host.heading)}</div>`
    current = host.win.firstElementChild
    return current
  }
  const finish = (box, won, msg) => {
    if (box.done) return // A CHALLENGE ENDS ONCE (E.G. A WIN AND A GIVE-UP CANNOT BOTH COUNT)
    box.done = true
    box.cleanup?.()
    current = null
    C.blocked = false
    if (won) { C.status(msg); host.onWin(msg) }
    else { if (!host.noPenalty) penalty(); host.onLose() } // MINIGAMES SKIP THE CHIPS: LOSING IS COMMON THERE
  }
  // PRESENTER ESCAPE HATCH: ` THREE TIMES (CALM MODE) WINS WHATEVER IS OPEN, EVEN THE MAZE
  C.onCalm.push((on) => on && current && finish(current, true, 'PRESENTER SKIPPED IT.'))
  // WHILE TRAPPED IN THE MAZE THE MOUSE WHEEL MUST NOT SCROLL THE PAGE AWAY FROM UNDER THE CURSOR
  addEventListener('wheel', (e) => { if (C.confine) e.preventDefault() }, { passive: false })

  // ---------- MAZE: ONCE INSIDE, YOU ARE STUCK UNTIL YOU BEAT IT ----------
  // THE CURSOR IS TELEPORTED ONTO GREEN AND CONFINED TO THE MAZE. A WALL SENDS IT BACK TO GREEN.
  // NO GIVE-UP BUTTON. ENTERING TAKES ONE CLICK (POINTER LOCK NEEDS A CLICK). NO FULLSCREEN: NOTHING TAKES OVER.
  function maze() {
    const COLS = 9, ROWS = 7, CELL = 16, WALL = 3 // FEW CELLS, THIN WALLS, DRAWN BIG: EASY WIDE CORRIDORS
    const W = COLS * CELL + WALL, H = ROWS * CELL + WALL
    const box = interrupt(`<h4>AD BLOCKER DETECTED 🧱</h4>
      <p class="mb-1">BEAT THE MAZE TO UNLOCK THIS. <b class="text-success">GREEN</b> → <b class="text-danger">RED</b>.
        3 STRIKES: EVERY WALL TOUCH (OR LEAVING) IS A STRIKE, THE THIRD SENDS YOU BACK TO GREEN.</p>
      <canvas class="maze-canvas" width="${W}" height="${H}"></canvas>
      <p class="maze-msg mb-2">&nbsp;</p>
      <button class="enter invisible">CLICK TO ENTER THE MAZE</button>`, 'AD BLOCKER.EXE — MAZE')
    const cv = box.querySelector('canvas'), ctx = cv.getContext('2d', { willReadFrequently: true })
    // DRAWN AT THE WINDOW'S FULL WIDTH (HIT TESTING ALREADY ACCOUNTS FOR THE SCALE)
    box.classList.add('maze-box')
    cv.style.width = '100%'

    // CARVE A PERFECT MAZE WITH AN ITERATIVE DEPTH-FIRST SEARCH.
    ctx.fillStyle = '#111'
    ctx.fillRect(0, 0, W, H)
    ctx.fillStyle = '#fff'
    const cell = (x, y) => ctx.fillRect(x * CELL + WALL, y * CELL + WALL, CELL - WALL, CELL - WALL)
    const seen = new Set(['0,0']), stack = [[0, 0]]
    cell(0, 0)
    while (stack.length) {
      const [x, y] = stack[stack.length - 1]
      const opts = [[1, 0], [-1, 0], [0, 1], [0, -1]].map(([dx, dy]) => [x + dx, y + dy, dx, dy])
        .filter(([nx, ny]) => nx >= 0 && ny >= 0 && nx < COLS && ny < ROWS && !seen.has(`${nx},${ny}`))
      if (!opts.length) { stack.pop(); continue }
      const [nx, ny, dx, dy] = C.pick(opts)
      seen.add(`${nx},${ny}`)
      cell(nx, ny)
      // KNOCK OUT THE WALL BETWEEN THE TWO CELLS
      ctx.fillRect(Math.min(x, nx) * CELL + WALL + (dx ? CELL - WALL : 0), Math.min(y, ny) * CELL + WALL + (dy ? CELL - WALL : 0),
        dx ? WALL : CELL - WALL, dy ? WALL : CELL - WALL)
      stack.push([nx, ny])
    }
    ctx.fillStyle = '#2ecc40'; cell(0, 0)
    ctx.fillStyle = '#ff4136'; cell(COLS - 1, ROWS - 1)

    const colorAt = (x, y) => {
      if (x < 0 || y < 0 || x >= W || y >= H) return 'wall'
      const [r, g] = ctx.getImageData(x, y, 1, 1).data
      if (r < 60 && g < 60) return 'wall'
      if (r > 200 && g < 100) return 'end'
      if (g > 180 && r < 100) return 'start'
      return 'path'
    }
    const msg = (t) => (box.querySelector('.maze-msg').textContent = t)
    const enter = box.querySelector('.enter')
    let attempts = 1, last = null, entered = false
    const startCanvas = { x: WALL + (CELL - WALL) / 2, y: WALL + (CELL - WALL) / 2 } // CENTER OF THE GREEN CELL
    const rectOf = (el) => { const r = el.getBoundingClientRect(); return { left: r.left, top: r.top, right: r.right, bottom: r.bottom } }
    // TELEPORT THE CURSOR ONTO GREEN AND TRAP IT INSIDE THE MAZE
    const toStart = () => {
      const rc = cv.getBoundingClientRect(), s = rc.width / W
      C.confine = rectOf(cv)
      C.cursorTo(rc.left + startCanvas.x * s, rc.top + startCanvas.y * s)
      last = { ...startCanvas }
    }
    // ESC STILL FREES THE CURSOR FROM THE TRAP (BROWSERS GUARANTEE THAT), BUT NOT FROM THE MAZE: PROGRESS THEN
    // ONLY COUNTS FROM GREEN AND LEAVING THE MAZE COUNTS AS A WALL.
    const sync = () => {
      if (!entered) return
      enter.classList.toggle('invisible', C.locked) // INVISIBLE, NOT HIDDEN: KEEPS THE LAYOUT STILL SO GREEN STAYS PUT
      if (C.locked) { toStart(); msg(`GO! ATTEMPT ${attempts}. YOU HAVE 3 STRIKES.`) }
      else { last = null; C.confine = null; msg(C.requestLock ? 'CURSOR ESCAPED THE TRAP, NOT THE MAZE. BACK TO GREEN.' : 'MOVE ONTO THE GREEN SQUARE TO START.') }
    }
    enter.addEventListener('click', () => {
      if (entered && C.locked) return
      entered = true
      C.blocked = true // NORMAL ARROW CURSOR WHILE INSIDE
      enter.textContent = 'CLICK TO GET BACK IN'
      C.requestLock?.() // ONLY PAGES WITH THE CURSED CURSOR CAN TRAP THE MOUSE
      sync()
    })
    document.addEventListener('pointerlockchange', sync)
    requestAnimationFrame(() => { enter.classList.remove('invisible'); msg('ENTER WHEN READY.') })

    // 3 STRIKES. ONE TOUCH = ONE STRIKE: A SHORT GRACE PERIOD STOPS ONE SCRAPE FROM COUNTING 60 TIMES.
    // RETURNS TRUE WHEN THE THIRD STRIKE SENT YOU BACK TO GREEN.
    let strikes = 0, graceUntil = 0
    const hit = () => {
      const now = performance.now()
      if (now < graceUntil) return false
      graceUntil = now + 700
      strikes++
      C.beep(110, 250)
      if (strikes < 3) { msg(`STRIKE ${strikes} OF 3: ${'❌'.repeat(strikes)}${'⬜'.repeat(3 - strikes)} KEEP GOING.`); return false }
      strikes = 0
      attempts++
      if (C.locked) { msg(`3 STRIKES! BACK TO GREEN. ATTEMPT ${attempts}.`); toStart() }
      else { last = null; msg(`3 STRIKES! GO BACK TO THE GREEN SQUARE. ATTEMPT ${attempts}.`) }
      return true
    }
    const onMove = (e) => {
      if (!entered) return
      const rc = cv.getBoundingClientRect()
      const x = (e.clientX - rc.left) * (W / rc.width), y = (e.clientY - rc.top) * (H / rc.height)
      // NOT STARTED (FREE REAL MOUSE): PROGRESS ONLY BEGINS ON GREEN. LEAVING THE MAZE COUNTS AS A WALL.
      if (!last) {
        if (colorAt(Math.floor(x), Math.floor(y)) === 'start') { last = { x, y }; strikes = 0; msg(`GO! ATTEMPT ${attempts}. YOU HAVE 3 STRIKES.`) }
        return
      }
      // SAMPLE ALONG THE PATH SO A FAST MOVE CANNOT JUMP THROUGH A WALL
      const steps = Math.max(1, Math.ceil(Math.hypot(x - last.x, y - last.y) / 2))
      for (let i = 1; i <= steps; i++) {
        const c = colorAt(Math.floor(last.x + ((x - last.x) * i) / steps), Math.floor(last.y + ((y - last.y) * i) / steps))
        if (c === 'wall') { if (!hit()) last = { x, y }; return } // A STRIKE: CARRY ON FROM HERE
        if (c === 'end') {
          C.beep(880, 250)
          return finish(box, true, `MAZE CLEARED IN ${attempts} ATTEMPT${attempts > 1 ? 'S' : ''}. YOU ARE FREE. FOR 45 SECONDS.`)
        }
      }
      last = { x, y }
    }
    addEventListener('pointermove', onMove)
    box.cleanup = () => {
      removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerlockchange', sync)
      C.confine = null
    }
  }

  // ---------- CAPTCHA: A SLIGHTLY SADDER SHADE OF BLUE ----------
  function captcha() {
    const sad = new Set()
    const n = 2 + Math.floor(Math.random() * 3)
    while (sad.size < n) sad.add(Math.floor(Math.random() * 9))
    const box = interrupt(`<h4>ARE YOU HUMAN?</h4>
      <p>SELECT ALL SQUARES CONTAINING A <b>SLIGHTLY SADDER SHADE OF BLUE</b>.</p>
      <div class="captcha-grid">${Array.from({ length: 9 }, (_, i) =>
        `<button class="captcha-tile" data-i="${i}" style="background: ${sad.has(i) ? 'hsl(212 62% 50%)' : 'hsl(210 72% 54%)'}"></button>`).join('')}</div>
      <button class="verify">VERIFY</button>`, 'HUMAN CHECK.EXE')
    box.querySelector('.captcha-grid').addEventListener('click', (e) => e.target.closest('.captcha-tile')?.classList.toggle('picked'))
    box.querySelector('.verify').addEventListener('click', () => {
      const picked = new Set(C.$$('.captcha-tile.picked', box).map((t) => +t.dataset.i))
      const ok = picked.size === sad.size && [...sad].every((i) => picked.has(i))
      finish(box, ok, 'VERIFIED: YOU CAN PERCEIVE SADNESS. WELCOME BACK.')
    })
  }

  // ---------- XO (TIC-TAC-TOE): THE COMPUTER IS DUMB ON PURPOSE. WIN OR TIE TO PASS ----------
  const LINES = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]
  const winner = (b) => LINES.find(([a, c, d]) => b[a] && b[a] === b[c] && b[a] === b[d]) ? b[LINES.find(([a, c, d]) => b[a] && b[a] === b[c] && b[a] === b[d])[0]] : null
  function xo() {
    const board = Array(9).fill('')
    let busy = false
    const box = interrupt(`<h4>AD BLOCKER DETECTED: BEAT THE AD AT XO ❌⭕</h4>
      <p class="mb-1">YOU ARE <b>X</b>. WIN OR TIE TO CONTINUE. LOSE = PENALTY.</p>
      <div class="xo-grid">${board.map((_, i) => `<button class="xo-cell" data-i="${i}"></button>`).join('')}</div>
      <p class="xo-msg mb-2">YOUR MOVE.</p>
      <button class="give-up">GIVE UP (ACCEPT PENALTY)</button>`, 'AD BLOCKER.EXE — XO')
    const draw = () => C.$$('.xo-cell', box).forEach((c, i) => (c.textContent = board[i]))
    const end = () => {
      const w = winner(board)
      if (!w && board.includes('')) return false
      busy = true
      const msg = w === 'X' ? 'YOU BEAT THE AD. IT IS EMBARRASSED.' : w === 'O' ? '' : 'A TIE. THE AD BLOCKER ALLOWS IT.'
      box.querySelector('.xo-msg').textContent = w === 'O' ? 'THE AD WINS.' : msg
      setTimeout(() => finish(box, w !== 'O', msg), 700)
      return true
    }
    box.querySelector('.xo-grid').addEventListener('click', (e) => {
      const i = e.target.dataset.i
      if (busy || i === undefined || board[i]) return
      board[i] = 'X'
      draw()
      if (end()) return
      busy = true
      setTimeout(() => {
        // TAKE A WINNING SQUARE IF THERE IS ONE, OTHERWISE PLAY RANDOMLY (NEVER BLOCKS YOU)
        const free = board.map((v, k) => (v ? -1 : k)).filter((k) => k >= 0)
        const win = free.find((k) => { board[k] = 'O'; const ok = winner(board) === 'O'; board[k] = ''; return ok })
        board[win ?? C.pick(free)] = 'O'
        draw()
        busy = false
        end()
      }, 400)
    })
    box.querySelector('.give-up').addEventListener('click', () => finish(box, false))
  }

  // ---------- EASY SUDOKU: 4X4, 6 BLANKS. CLICK A BLANK TO CYCLE 1-4. ANY VALID FILL PASSES ----------
  function sudoku() {
    const digits = [1, 2, 3, 4].sort(() => Math.random() - 0.5) // RELABEL A KNOWN-VALID GRID
    const grid = [[1, 2, 3, 4], [3, 4, 1, 2], [2, 1, 4, 3], [4, 3, 2, 1]].flat().map((d) => digits[d - 1])
    const blanks = new Set()
    while (blanks.size < 6) blanks.add(Math.floor(Math.random() * 16))
    const vals = grid.map((d, i) => (blanks.has(i) ? 0 : d))
    const box = interrupt(`<h4>AD BLOCKER DETECTED: EASY SUDOKU 🔢</h4>
      <p class="mb-1">FILL THE BLANKS SO EVERY ROW, COLUMN AND 2×2 BOX HAS 1, 2, 3 AND 4. CLICK A BLANK TO CHANGE IT.</p>
      <div class="sudoku-grid">${vals.map((d, i) => `<button class="sudoku-cell${blanks.has(i) ? ' blank' : ''}" data-i="${i}"${blanks.has(i) ? '' : ' disabled'}>${d || ''}</button>`).join('')}</div>
      <button class="check">CHECK</button>
      <button class="give-up">GIVE UP (ACCEPT PENALTY)</button>`, 'AD BLOCKER.EXE — SUDOKU')
    box.querySelector('.sudoku-grid').addEventListener('click', (e) => {
      const i = e.target.dataset.i
      if (i === undefined || !blanks.has(+i)) return
      vals[i] = (vals[i] % 4) + 1
      e.target.textContent = vals[i]
    })
    const valid = () => {
      const groups = []
      for (let k = 0; k < 4; k++) {
        groups.push([0, 1, 2, 3].map((j) => vals[k * 4 + j])) // ROW
        groups.push([0, 1, 2, 3].map((j) => vals[j * 4 + k])) // COLUMN
        const r = Math.floor(k / 2) * 2, c = (k % 2) * 2
        groups.push([vals[r * 4 + c], vals[r * 4 + c + 1], vals[(r + 1) * 4 + c], vals[(r + 1) * 4 + c + 1]]) // 2X2 BOX
      }
      return groups.every((g) => new Set(g).size === 4 && !g.includes(0))
    }
    box.querySelector('.check').addEventListener('click', () => finish(box, valid(), 'SUDOKU SOLVED. THE AD BLOCKER RESPECTS YOUR BRAIN.'))
    box.querySelector('.give-up').addEventListener('click', () => finish(box, false))
  }

  // ---------- MINIGAMES (PREV / NEXT VIDEO): QUICK GAMES OF LUCK AND REFLEX. LOSING JUST SERVES ANOTHER ONE ----------
  // ROCK PAPER SCISSORS: A TIE MEANS AGAIN
  function rps() {
    const HANDS = { ROCK: '🪨', PAPER: '📄', SCISSORS: '✂️' }, BEATS = { ROCK: 'SCISSORS', PAPER: 'ROCK', SCISSORS: 'PAPER' }
    const box = interrupt(`<h4>AD BLOCKER DETECTED: ROCK PAPER SCISSORS</h4><p>BEAT THE COMPUTER. A TIE = AGAIN.</p>
      <div class="game-row">${Object.entries(HANDS).map(([k, e]) => `<button class="game-btn" data-pick="${k}">${e}<br>${k}</button>`).join('')}</div>
      <p class="game-msg">&nbsp;</p>`, 'AD BLOCKER.EXE — ROCK PAPER SCISSORS')
    box.addEventListener('click', (e) => {
      const me = e.target.closest('[data-pick]')?.dataset.pick
      if (!me || box.done || box.thinking) return
      const cpu = C.pick(Object.keys(HANDS))
      const said = `YOU: ${HANDS[me]} · COMPUTER: ${HANDS[cpu]}. `
      if (me === cpu) return (box.querySelector('.game-msg').textContent = said + 'TIE. AGAIN.')
      box.thinking = true
      box.querySelector('.game-msg').textContent = said + (BEATS[me] === cpu ? 'YOU WIN.' : 'YOU LOSE.')
      setTimeout(() => finish(box, BEATS[me] === cpu, 'ROCK PAPER SCISSORS: WON.'), 700)
    })
  }
  // COIN FLIP: CALL IT
  function coin() {
    const box = interrupt(`<h4>AD BLOCKER DETECTED: COIN FLIP</h4><p>CALL IT.</p>
      <div class="game-row"><button class="game-btn" data-pick="HEADS">🙂<br>HEADS</button><button class="game-btn" data-pick="TAILS">🐍<br>TAILS</button></div>
      <p class="game-msg">&nbsp;</p>`, 'AD BLOCKER.EXE — COIN FLIP')
    box.addEventListener('click', (e) => {
      const me = e.target.closest('[data-pick]')?.dataset.pick
      if (!me || box.done || box.thinking) return
      box.thinking = true
      const side = C.pick(['HEADS', 'TAILS'])
      box.querySelector('.game-msg').textContent = `🪙 IT'S ${side}. ${side === me ? 'YOU WIN.' : 'YOU LOSE.'}`
      setTimeout(() => finish(box, side === me, 'COIN FLIP: WON.'), 700)
    })
  }
  // HIGHER OR LOWER: WILL THE NEXT NUMBER (1–9, NEVER THE SAME) BE HIGHER?
  function higherLower() {
    const now = 2 + Math.floor(Math.random() * 7)
    const box = interrupt(`<h4>AD BLOCKER DETECTED: HIGHER OR LOWER</h4><p>THE NUMBER IS <b class="big">${now}</b>. THE NEXT ONE (1–9) WILL BE…</p>
      <div class="game-row"><button class="game-btn" data-pick="HIGHER">⬆️<br>HIGHER</button><button class="game-btn" data-pick="LOWER">⬇️<br>LOWER</button></div>
      <p class="game-msg">&nbsp;</p>`, 'AD BLOCKER.EXE — HIGHER OR LOWER')
    box.addEventListener('click', (e) => {
      const me = e.target.closest('[data-pick]')?.dataset.pick
      if (!me || box.done || box.thinking) return
      box.thinking = true
      let next = now
      while (next === now) next = 1 + Math.floor(Math.random() * 9)
      const right = (next > now) === (me === 'HIGHER')
      box.querySelector('.game-msg').textContent = `IT'S ${next}. ${right ? 'YOU WIN.' : 'YOU LOSE.'}`
      setTimeout(() => finish(box, right, 'HIGHER OR LOWER: WON.'), 700)
    })
  }
  // GUESS THE NUMBER: 1–5, TWO TRIES, WITH A HINT AFTER THE FIRST
  function guess() {
    const secret = 1 + Math.floor(Math.random() * 5)
    let tries = 2
    const box = interrupt(`<h4>AD BLOCKER DETECTED: GUESS THE NUMBER</h4><p>I'M THINKING OF A NUMBER FROM 1 TO 5. TWO TRIES.</p>
      <div class="game-row">${[1, 2, 3, 4, 5].map((n) => `<button class="game-btn small" data-pick="${n}">${n}</button>`).join('')}</div>
      <p class="game-msg">&nbsp;</p>`, 'AD BLOCKER.EXE — GUESS THE NUMBER')
    box.addEventListener('click', (e) => {
      const b = e.target.closest('[data-pick]'), n = +b?.dataset.pick
      if (!n || box.done || box.thinking || b.disabled) return
      b.disabled = true
      tries--
      if (n === secret) { box.thinking = true; box.querySelector('.game-msg').textContent = `YES! ${n}.`; return setTimeout(() => finish(box, true, 'GUESS THE NUMBER: WON.'), 700) }
      if (tries) return (box.querySelector('.game-msg').textContent = `NOPE. IT'S ${secret > n ? 'HIGHER' : 'LOWER'}. ONE MORE TRY.`)
      box.thinking = true
      box.querySelector('.game-msg').textContent = `NOPE. IT WAS ${secret}.`
      setTimeout(() => finish(box, false), 700)
    })
  }
  // REACTION TEST: CLICK WHEN IT TURNS GREEN (WITHIN 0.8 S). TOO EARLY OR TOO SLOW = LOSE
  function reaction() {
    const box = interrupt(`<h4>AD BLOCKER DETECTED: REACTION TEST</h4><p>CLICK THE BUTTON THE MOMENT IT TURNS GREEN. NOT BEFORE.</p>
      <div class="game-row"><button class="game-btn react" data-pick="GO">WAIT…</button></div>
      <p class="game-msg">&nbsp;</p>`, 'AD BLOCKER.EXE — REACTION TEST')
    const btn = box.querySelector('.react')
    let greenAt = 0
    const t = setTimeout(() => { greenAt = performance.now(); btn.classList.add('go'); btn.textContent = 'CLICK!' }, 1200 + Math.random() * 1800)
    const late = setInterval(() => {
      if (!greenAt || performance.now() - greenAt <= 800 || box.done) return
      clearInterval(late)
      box.querySelector('.game-msg').textContent = 'TOO SLOW.'
      finish(box, false)
    }, 50)
    box.cleanup = () => { clearTimeout(t); clearInterval(late) }
    btn.addEventListener('click', () => {
      if (box.done) return
      const ok = greenAt > 0
      box.querySelector('.game-msg').textContent = ok ? `${Math.round(performance.now() - greenAt)} MS. NICE.` : 'TOO EARLY.'
      finish(box, ok, 'REACTION TEST: WON.')
    })
  }

  // ---------- PENALTY: 15S OF SOMEONE LOUDLY EATING CHIPS ----------
  function penalty() {
    C.status('PENALTY: AUDIO SWITCHED TO "COMMENTARY — GUY EATING CHIPS (EN)" 🎙️')
    const a = C.audio(), endAt = Date.now() + 15000
    const crunch = () => {
      if (Date.now() > endAt) return
      // A CRUNCH = SHORT BURST OF DECAYING NOISE THROUGH A RANDOM BAND-PASS
      const len = C.rand(0.05, 0.15), buf = a.createBuffer(1, Math.floor(a.sampleRate * len), a.sampleRate), ch = buf.getChannelData(0)
      for (let i = 0; i < ch.length; i++) ch[i] = (Math.random() * 2 - 1) * (1 - i / ch.length) ** 2
      const src = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain()
      src.buffer = buf
      f.type = 'bandpass'
      f.frequency.value = C.rand(1500, 5000)
      g.gain.value = 0.5
      src.connect(f).connect(g).connect(a.destination)
      src.start()
      setTimeout(crunch, C.rand(90, 450))
    }
    crunch()
  }

  C.interrupts = { maze, captcha, xo, sudoku, rps, coin, higherLower, guess, reaction }
  C.penalty = penalty

  // RUN A RANDOM CHALLENGE FROM HOST.POOL IN THE HOST'S WINDOW
  C.runChallenge = (h) => { host = h; C.pick(h.pool)() }
})()
