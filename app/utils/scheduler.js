// Schedule event to occur after delay
class Scheduler {
  constructor (func, delay, reference = null) {
    this.timer = null
    this.delay = delay
    this.func = func
    this.reference = reference
    this.timeLeftWhenPaused = null
    this.allowPause = false
  }

  get timeLeft () {
    if (this.timer === null) return false
    if (this.timeLeftWhenPaused !== null) return this.timeLeftWhenPaused
    return this.now + this.delay - Date.now()
  }

  pause () {
    if (!this.allowPause || this.timer === null || this.timeLeftWhenPaused !== null) return
    clearTimeout(this.timer)
    this.timeLeftWhenPaused = this.timeLeft
    return true
  }

  resume () {
    if (this.timer === null || this.timeLeftWhenPaused === null) return
    this.delay = Math.max(100, this.timeLeftWhenPaused)
    this.timeLeftWhenPaused = null
    this.plan()
  }

  plan (allowPause = false) {
    this.allowPause = allowPause
    this.now = Date.now()
    this.timer = setTimeout(this.func, this.delay)
  }

  correct () {
    if (this.timer === null) return
    clearTimeout(this.timer)
    this.timer = setTimeout(this.func, this.timeLeft)
  }

  cancel () {
    clearTimeout(this.timer)
    this.timer = null
    this.reference = null
    this.func = null
  }
}

module.exports = Scheduler
