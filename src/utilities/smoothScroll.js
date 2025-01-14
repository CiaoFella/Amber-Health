import { Lenis } from '../vendor.js'

const lenis = new Lenis({
  lerp: 0.1,
  wheelMultiplier: 0.7,
  gestureOrientation: 'vertical',
  normalizeWheel: false,
  smoothTouch: false,
})
function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

document.querySelectorAll('[data-lenis-start]').forEach(function (element) {
  element.addEventListener('click', function () {
    lenis.start()
  })
})

document.querySelectorAll('[data-lenis-stop]').forEach(function (element) {
  element.addEventListener('click', function () {
    lenis.stop()
  })
})

document.querySelectorAll('[data-lenis-toggle]').forEach(function (element) {
  element.addEventListener('click', function () {
    element.classList.toggle('stop-scroll')
    if (element.classList.contains('stop-scroll')) {
      lenis.stop()
    } else {
      lenis.start()
    }
  })
})

export default lenis
