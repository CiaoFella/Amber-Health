import { topClipPath, fullClipPath, isDesktop, isTablet } from '../../utilities/variables.js'
import { gsap, ScrollTrigger, SplitType } from '../../vendor.js'

let context

const mm = gsap.matchMedia()

function init() {
  const section = document.querySelector('[anm-hero=section]')
  if (section) {
    const headline = section.querySelector('[anm-hero=headline]')
    const text = section.querySelector('[anm-hero=text]')
    const brandCircle = section.querySelector('.g_brand_circle')
    const circles = section.querySelector('[anm-hero=circles]')
    const bg = section.querySelector('[anm-hero=bg]')
    const trustLogos = section.querySelector('[anm-hero=trust-logos]').children

    const headlineSplit = new SplitType(headline, { types: 'chars' })
    const textSplit = new SplitType(text, { types: 'lines' })

    context = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { duration: 1.5, ease: 'expo.out' },
        paused: true,
      })
      tl.to(headlineSplit.chars, { yPercent: -110, rotate: 0, stagger: 0.025 })
        .to(textSplit.lines, { y: '0rem', rotate: 0, clipPath: fullClipPath, stagger: 0.1 }, '<+0.25')
        .to(brandCircle, { scale: 1, rotate: 0 }, '<+0.25')
        .to(circles, { x: '0rem', rotate: 0 }, '<+0.25')
        .to(trustLogos, { yPercent: -110, stagger: 0.1 }, '<+0.25')
      tl.play()
    })
  }
}

function cleanup() {
  context && context.revert()
}

export default {
  init,
  cleanup,
}
