import createSplitTypes from './utilities/createSplitTypes.js'
import { cursor, magneticCursor } from './utilities/customCursor/customCursor.js'
import { closeMenu } from './utilities/helper.js'
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

barba.init({
  preventRunning: true,
  transitions: [
    {
      name: 'default-transition',
      async leave(data) {
        const done = this.async()
        const transitionWrap = document.querySelector('[anm-transition=wrap]')
        const transitionLogo = document.querySelector('[anm-transition=logo]')
        const transitionDarkBg = document.querySelector('[anm-transition=dark-bg]')

        const tl = gsap.timeline({ defaults: { duration: 1, ease: 'expo.inOut' } })

        proxy.pageReady = false

        tl.set(transitionWrap, {
          display: 'flex',
        }).set(transitionLogo, {
          yPercent: 100,
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
        ).to(transitionLogo, { yPercent: 0, duration: 1, ease: 'expo.out' }, '<+75%')
      },
      after(data) {
        const transitionWrap = document.querySelector('[anm-transition=wrap]')
        const transitionLogo = document.querySelector('[anm-transition=logo]')
        const transitionDarkBg = document.querySelector('[anm-transition=dark-bg]')

        mm.add(isDesktop, () => {
          const customCursor = document.querySelector('.cb-cursor')
          customCursor.remove()
          cursor.init()
          magneticCursor()
        })

        createSplitTypes.cleanup()
        createSplitTypes.init()

        const navbar = document.querySelector('[anm-navbar=wrap]')

        if (navbar) {
          navbar.classList.remove('is-scrolled', 'is-hidden')
        }

        const tl = gsap.timeline({ defaults: { duration: 1, ease: 'expo.inOut', onComplete: () => locomotiveScroll.start() } })

        tl.to(transitionLogo, { yPercent: -100, duration: 1, ease: 'expo.in' }).to(
          transitionDarkBg,
          {
            clipPath: topClipPath,
            onStart: () => {
              window.scrollTo(0, 0)
            },
            onComplete: () => {
              gsap.set(transitionWrap, { display: 'none' })
              proxy.pageReady = true
            },
          },
          '<+50%'
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
