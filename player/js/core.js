// SHARED NAMESPACE. CLASSIC SCRIPTS SHARE IT THROUGH WINDOW SO THE PAGE WORKS FROM FILE://.
window.C = {
  calm: matchMedia('(prefers-reduced-motion: reduce)').matches, // REDUCED MOTION STARTS IN CALM MODE
  locked: false,
  started: false,
  blocked: false, // TRUE WHILE A MAZE/CAPTCHA OWNS THE SCREEN
  confine: null, // BOX THE CURSOR IS TRAPPED IN (THE MAZE), OR NULL
  cursor: { x: innerWidth / 2, y: innerHeight / 2 },
  onCalm: [],
}

C.$ = (s, r = document) => r.querySelector(s)
C.$$ = (s, r = document) => [...r.querySelectorAll(s)]
C.rand = (a, b) => a + Math.random() * (b - a)
C.pick = (arr) => arr[Math.floor(Math.random() * arr.length)]
C.fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

// VIDEO METADATA FORMATTING, SHARED BY THE GRID AND THE WATCH PAGE
C.ago = (iso) => {
  const months = Math.floor((Date.now() - new Date(iso)) / (30.44 * 864e5))
  if (months < 1) return 'THIS MONTH'
  if (months < 12) return `${months} MONTH${months > 1 ? 'S' : ''} AGO`
  const y = Math.floor(months / 12)
  return `${y} YEAR${y > 1 ? 'S' : ''} AGO`
}
// VIEW COUNTS: A FAKE BASE NUMBER FROM VIDEOS.JS + THIS BROWSER'S OWN WATCHES (LOCALSTORAGE; BLOCKED = +0).
C.views = (id) => { try { return +localStorage.getItem(`views:${id}`) || 0 } catch { return 0 } }
C.addView = (id) => { try { localStorage.setItem(`views:${id}`, C.views(id) + 1) } catch { /* NOT SAVED, FINE */ } }
C.compact = (n) => (n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `${(n / 1e3).toFixed(1)}K` : `${n}`).replace('.0', '')
C.viewsText = (id, base = 0, full = false) => { const n = base + C.views(id); return `${full ? n.toLocaleString('en-US') : C.compact(n)} VIEWS` }
C.fmtLength = (s) => {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = String(s % 60).padStart(2, '0')
  return h ? `${h}:${String(m).padStart(2, '0')}:${sec}` : `${m}:${sec}`
}

let statusTimer
C.status = (msg) => {
  const el = C.$('#status')
  el.textContent = msg
  clearTimeout(statusTimer)
  statusTimer = setTimeout(() => (el.textContent = ''), 6000)
}

let ac
C.audio = () => (ac ??= new AudioContext())
C.beep = (freq, ms, at = 0) => {
  try {
    const a = C.audio(), o = a.createOscillator(), g = a.createGain()
    o.frequency.value = freq
    g.gain.value = 0.08
    o.connect(g).connect(a.destination)
    const t = a.currentTime + at
    o.start(t)
    o.stop(t + ms / 1000)
  } catch { /* NO SOUND IS FINE */ }
}


C.setCalm = (on) => {
  C.calm = on
  document.body.classList.toggle('calm', on)
  if (on && document.pointerLockElement) document.exitPointerLock()
  C.onCalm.forEach((f) => f(on))
  C.status(on ? 'PRESENTER CALM MODE ON. PRESS ` THREE TIMES TO BRING THE CHAOS BACK.' : 'CHAOS RESTORED.')
}

// PRESENTER ESCAPE HATCH: ` THREE TIMES WITHIN 1.5S TOGGLES CALM MODE. (ESC IS RESERVED: IT RELEASES POINTER LOCK.)
let hits = []
addEventListener('keydown', (e) => {
  if (e.code !== 'Backquote') return
  hits = [...hits.filter((t) => Date.now() - t < 1500), Date.now()]
  if (hits.length >= 3) { hits = []; C.setCalm(!C.calm) }
})
document.body.classList.toggle('calm', C.calm)
