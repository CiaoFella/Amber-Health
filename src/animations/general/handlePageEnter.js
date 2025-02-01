import { fullClipPath } from '../../utilities/variables.js'
import { gsap, SplitType } from '../../vendor.js'

const mm = gsap.matchMedia()

export default function handlePageEnterAnimation(currentPage) {
  const barbaWrapper = document.querySelector(`[data-barba-namespace=${currentPage}]`)
  if (!barbaWrapper) return

  const section = barbaWrapper.querySelector('[anm-hero=section]')
  let tl = null
  if (section) {
    const headline = section.querySelector('[anm-hero=headline]')
    const text = section.querySelector('[anm-hero=text]')
    const brandCircle = section.querySelector('.g_brand_circle')
    const circles = section.querySelector('[anm-hero=circles]')
    const bg = section.querySelector('[anm-hero=bg]')

    let trustLogos = null
    if (section.querySelector('[anm-hero=trust-logos]')) {
      trustLogos = section.querySelector('[anm-hero=trust-logos]').children
    }

    const headlineSplit = new SplitType(headline, { types: 'chars' })
    const textSplit = new SplitType(text, { types: 'lines' })
    tl = gsap.timeline({
      defaults: { duration: 1.5, ease: 'expo.out' },
      paused: true,
    })
    tl.to(headlineSplit.chars, { y: 0, rotate: 0, stagger: 0.025 })
      .to(textSplit.lines, { y: '0rem', rotate: 0, clipPath: fullClipPath, stagger: 0.1 }, '<+0.25')
      .to(brandCircle, { scale: 1, rotate: 0 }, '<+0.25')
      .to(circles, { x: '0rem', rotate: 0 }, '<+0.25')
      .to(trustLogos, { yPercent: -110, stagger: 0.1 }, '<+0.25')
  }

  return tl
}
