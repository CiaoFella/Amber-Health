import { gsap, ScrollTrigger } from '../../vendor.js'

let backgroundCtx, navbarCtx

function init() {
  const navbar = document.querySelector('[anm-navbar=wrap]')
  if (!navbar) return

  const container = navbar.querySelector('[anm-navbar=container]')
  const cta = navbar.querySelector('[anm-btn]')

  const currentColor = getComputedStyle(navbar).color
  const currentBackgroundColor = getComputedStyle(navbar).backgroundColor

  const background = 'var(--swatch--light)'
  const textColor = 'var(--swatch--dark)'

  const backgroundTl = gsap.timeline({
    defaults: { duration: 0.5, ease: 'power1.inOut' },
    paused: true,
  })

  const navbarTl = gsap.timeline({
    defaults: { duration: 0.5, ease: 'power3.inOut' },
    paused: true,
  })

  backgroundTl
    .to(
      container,
      {
        paddingTop: '1.5rem',
        paddingBottom: '1.5rem',
      },
      0
    )
    .fromTo(
      navbar,
      {
        backgroundColor: currentBackgroundColor,
        color: currentColor,
      },
      {
        backgroundColor: background,
        color: textColor,
      },
      0
    )
    .to(cta, { backgroundColor: 'var(--swatch--dark)', color: 'var(--swatch--light)', borderColor: 'var(--swatch--dark)' }, 0)

  navbarTl.to(navbar, {
    yPercent: -100,
  })

  backgroundCtx = ScrollTrigger.create({
    start: 'top+=50 top',
    onUpdate: (self) => {
      if (self.direction === -1 && self.progress === 0) {
        backgroundTl.reverse()
        navbarTl.reverse()
      } else if (self.direction === 1 && self.progress > 0) {
        backgroundTl.play()
      }
    },
  })

  navbarCtx = ScrollTrigger.create({
    start: 'top+=50 top',
    onUpdate: (self) => {
      if (self.progress === 0) {
        navbarTl.reverse()
        return
      }

      if (self.direction === -1) {
        navbarTl.reverse()
      } else if (self.direction === 1) {
        navbarTl.play()
      }
    },
  })
}

function cleanup() {
  backgroundCtx && backgroundCtx.revert()
  navbarCtx && navbarCtx.revert()
}

export default {
  init,
  cleanup,
}
