// Web Audio synth — no external assets. Two flavours:
// 1) engineRev: short rising sweep for team switch
// 2) tick: small UI click

let ctx: AudioContext | null = null
function getCtx() {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const Ctx =
      (window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext }).AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctx) return null
    ctx = new Ctx()
  }
  return ctx
}

let muted = false
export function setMuted(m: boolean) {
  muted = m
}
export function isMuted() {
  return muted
}

export function engineRev() {
  const c = getCtx()
  if (!c || muted) return
  const now = c.currentTime
  const osc = c.createOscillator()
  const osc2 = c.createOscillator()
  const gain = c.createGain()
  const filter = c.createBiquadFilter()

  osc.type = 'sawtooth'
  osc2.type = 'square'
  osc.frequency.setValueAtTime(70, now)
  osc.frequency.exponentialRampToValueAtTime(420, now + 0.45)
  osc2.frequency.setValueAtTime(110, now)
  osc2.frequency.exponentialRampToValueAtTime(640, now + 0.45)

  filter.type = 'lowpass'
  filter.frequency.setValueAtTime(400, now)
  filter.frequency.exponentialRampToValueAtTime(3200, now + 0.4)
  filter.Q.value = 6

  gain.gain.setValueAtTime(0, now)
  gain.gain.linearRampToValueAtTime(0.22, now + 0.05)
  gain.gain.linearRampToValueAtTime(0, now + 0.55)

  osc.connect(filter)
  osc2.connect(filter)
  filter.connect(gain).connect(c.destination)
  osc.start(now)
  osc2.start(now)
  osc.stop(now + 0.6)
  osc2.stop(now + 0.6)
}

export function tick() {
  const c = getCtx()
  if (!c || muted) return
  const now = c.currentTime
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.type = 'square'
  osc.frequency.setValueAtTime(1200, now)
  osc.frequency.exponentialRampToValueAtTime(600, now + 0.08)
  gain.gain.setValueAtTime(0, now)
  gain.gain.linearRampToValueAtTime(0.05, now + 0.01)
  gain.gain.linearRampToValueAtTime(0, now + 0.1)
  osc.connect(gain).connect(c.destination)
  osc.start(now)
  osc.stop(now + 0.12)
}

export function boost() {
  const c = getCtx()
  if (!c || muted) return
  const now = c.currentTime
  const osc = c.createOscillator()
  const gain = c.createGain()
  const filter = c.createBiquadFilter()
  osc.type = 'sawtooth'
  osc.frequency.setValueAtTime(180, now)
  osc.frequency.exponentialRampToValueAtTime(1400, now + 0.3)
  filter.type = 'bandpass'
  filter.frequency.value = 1200
  filter.Q.value = 8
  gain.gain.setValueAtTime(0, now)
  gain.gain.linearRampToValueAtTime(0.18, now + 0.04)
  gain.gain.linearRampToValueAtTime(0, now + 0.4)
  osc.connect(filter).connect(gain).connect(c.destination)
  osc.start(now)
  osc.stop(now + 0.45)
}
