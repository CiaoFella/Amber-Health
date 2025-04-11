import createSplitTypes from './utilities/createSplitTypes.js'
import { closeMenu, closeAllDropdowns } from './utilities/helper.js'
import { proxy } from './utilities/pageReadyListener.js'
import { bottomClipPath, fullClipPath, isDesktop, topClipPath } from './utilities/variables.js'
import { gsap, barba, ScrollTrigger } from './vendor.js'
import locomotiveScroll from './utilities/smoothScroll.js'
import navBar from './animations/general/navBar.js'

gsap.registerPlugin(ScrollTrigger)

const mm = gsap.matchMedia()

barba.hooks.before((data) => {
  data.next.container.classList.add('is-animating')
})

barba.hooks.after((data) => {
  data.next.container.classList.remove('is-animating')
})

barba.hooks.beforeEnter(() => {
  closeAllDropdowns()
  createSplitTypes.cleanup()
})

barba.init({
  preventRunning: true,
  transitions: [
    {
      name: 'default-transition',
      async leave(data) {
        const done = this.async()
        const transitionWrap = document.querySelector('[anm-transition=wrap]')
        const transitionLogo = document.querySelectorAll('[anm-transition=logo]')
        const transitionDarkBg = document.querySelector('[anm-transition=dark-bg]')

        const tl = gsap.timeline({ defaults: { duration: 1, ease: 'expo.inOut' } })

        proxy.pageReady = false

        tl.set(transitionWrap, {
          display: 'flex',
        })
          .set(transitionLogo, {
            y: '5rem',
          })
          .set(transitionLogo[1], {
            y: '0rem',
            opacity: 0,
          })

        navBar.toggleFlyout(false)

        tl.fromTo(
          transitionDarkBg,
          { clipPath: bottomClipPath },
          {
            clipPath: fullClipPath,
            ease: 'expo.inOut',
            onComplete: () => {
              done()
            },
          }
        )
          .to(transitionLogo, { y: 0, duration: 1.5, ease: 'power4.inOut' }, '<')
          .to(transitionLogo[1], { opacity: 1, duration: 0.25 }, '<+0.5')
      },
      after(data) {
        const transitionWrap = document.querySelector('[anm-transition=wrap]')
        const transitionLogo = document.querySelectorAll('[anm-transition=logo]')
        const transitionDarkBg = document.querySelector('[anm-transition=dark-bg]')

        createSplitTypes.cleanup()
        createSplitTypes.init()

        const navbar = document.querySelector('[anm-navbar=wrap]')

        if (navbar) {
          navbar.classList.remove('is-scrolled', 'is-hidden')
        }

        const tl = gsap.timeline({ defaults: { duration: 1, ease: 'expo.inOut', onComplete: () => locomotiveScroll.start() } })

        tl.to(transitionLogo, { y: '-5rem', duration: 1.5, ease: 'power4.inOut' }).to(
          transitionDarkBg,
          {
            clipPath: topClipPath,
            onStart: () => {
              ScrollTrigger.refresh()
            },
            onComplete: () => {
              gsap.set(transitionWrap, { display: 'none' })
              proxy.pageReady = true
            },
          },
          '<+25%'
        )
      },
    },
  ],
  views: [
    {
      namespace: 'home',
      beforeEnter({ next }) {
        // Additional logic for home page before entering
      },
    },
    {
      namespace: 'about',
      beforeEnter({ next }) {
        // Additional logic for about page before entering
      },
    },
    {
      namespace: 'contact',
      beforeEnter({ next }) {
        // Additional logic for contact page before entering
      },
    },
  ],
})

export default barba
