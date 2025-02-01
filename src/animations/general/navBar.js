import { ScrollTrigger } from '../../vendor.js'

let scrollTrigger
let scrollTriggers = []

function init() {
  const navbar = document.querySelector('[anm-navbar=wrap]')
  if (!navbar) return

  // Add base class
  navbar.classList.add('navbar')

  scrollTrigger = ScrollTrigger.create({
    start: 'top+=50 top',
    onUpdate: (self) => {
      // Handle background/padding changes
      if (self.direction === -1 && self.progress === 0) {
        navbar.classList.remove('is-scrolled')
      } else if (self.direction === 1 && self.progress > 0) {
        navbar.classList.add('is-scrolled')
      }

      // Handle navbar hide/show
      if (self.direction === 1 && self.progress > 0) {
        navbar.classList.add('is-hidden')
      } else if (self.direction === -1) {
        navbar.classList.remove('is-hidden')
      }
    },
  })
}

function cleanup() {
  scrollTrigger && scrollTrigger.revert()
  scrollTriggers.forEach((cleanup) => cleanup())
  scrollTriggers = []
}

export default {
  init,
  cleanup,
}
