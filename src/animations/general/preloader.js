import { gsap } from '../../vendor.js'
import lenis from '../../utilities/smoothScroll.js'
import handlePageEnterAnimation from './handlePageEnter.js'
import locomotiveScroll from '../../utilities/smoothScroll.js'
import { fullClipPath, topClipPath } from '../../utilities/variables.js'
import { proxy } from '../../utilities/pageReadyListener.js'

let ctx

const mm = gsap.matchMedia()

function init(namespace) {
  const section = document.querySelector('[anm-preloader=wrap]')

  if (section) {
    const logo = section.querySelector('[anm-preloader=logo]')
    const logoText = section.querySelector('[anm-preloader=logo-text]')
    ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'expo.inOut', duration: 1.5 },
        onStart: () => {
          locomotiveScroll.stop()
          proxy.pageReady = false
        },
        onComplete: () => {
          locomotiveScroll.start()
          gsap.set(section, { display: 'none' })
        },
      })

      tl.to(logo, { y: 0, ease: 'expo.inOut' })
        .to([logo, logoText], { x: '0', y: '-5rem', ease: 'expo.inOut' })
        .fromTo(section, { clipPath: fullClipPath }, { clipPath: topClipPath, duration: 1.5 }, '<+0.25')
        .call(
          () => {
            proxy.pageReady = true
          },
          [],
          '>-50%'
        )
    })
  }
}

function cleanup() {
  if (ctx) {
    ctx.revert()
  }
}

export default {
  init,
  cleanup,
}
