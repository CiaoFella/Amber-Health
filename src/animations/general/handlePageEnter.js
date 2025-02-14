import { proxy } from '../../utilities/pageReadyListener.js'
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
    const texts = section.querySelectorAll('[anm-hero=text]')
    const brandCircle = section.querySelector('.g_brand_circle')
    const circles = section.querySelector('[anm-hero=circles]')
    const cta = section.querySelector('[anm-hero=cta]')
    const wave = section.querySelector('[anm-hero=wave]')
    const bg = section.querySelector('[anm-hero=bg]')
    const trustHeadline = section.querySelector('[anm-hero=trust-headline]')

    let trustLogos = null
    if (section.querySelector('[anm-hero=trust-logos]')) {
      trustLogos = section.querySelector('[anm-hero=trust-logos]').children
    }
    let ctaChildren = null
    if (cta) {
      ctaChildren = cta.children
    }
    if (wave) {
      wave.classList.add('is-transitioning')
    }

    const headlineSplitType = headline.dataset.splitType || 'chars, words'
    let textSplits = []
    let textSplitTypes = []

    texts.forEach((text) => {
      const textSplitType = text.dataset.splitType || 'lines'
      const textStagger = text.getAttribute('anm-stagger') || 0.1
      const textSplit = text.getAttribute('anm-static') === 'true' ? null : new SplitType(text, { types: [textSplitType] })

      if (textSplit) {
        textSplits.push({
          split: textSplit,
          type: textSplitType,
          stagger: textStagger,
        })
      }
    })

    const headlineStagger = headline.getAttribute('anm-stagger') || 0.25

    const headlineSplit = headline.getAttribute('anm-static') === 'true' ? null : new SplitType(headline, { types: headlineSplitType.split(', ') })

    tl = gsap.timeline({
      defaults: { duration: 1.5, ease: 'expo.out' },
      paused: true,
    })

    if (headline.getAttribute('anm-static') !== 'true' && headlineSplit) {
      const splitTypes = headlineSplitType.split(', ')
      splitTypes.forEach((type) => {
        if (headlineSplit[type]) {
          tl.to(
            headlineSplit[type],
            {
              opacity: 1,
              filter: 'blur(0px)',
              stagger: { amount: headlineStagger, from: 'random' },
            },
            '<'
          )
        }
      })
    }

    if (texts.length > 0) {
      textSplits.forEach(({ split, type, stagger }) => {
        if (split) {
          tl.to(
            split[type],
            {
              opacity: 1,
              filter: 'blur(0px)',
              stagger: { amount: stagger, from: 'random' },
            },
            '<+0.25'
          )
        }
      })
    }

    if (cta && cta.getAttribute('anm-static') !== 'true') {
      tl.to(cta, { opacity: 1, filter: 'blur(0px)' }, '<+0.25')
    }

    if (brandCircle && brandCircle.getAttribute('anm-static') !== 'true') {
      tl.to(brandCircle, { opacity: 1, filter: 'blur(0px)' }, '<+0.25')
    }

    if (circles && circles.getAttribute('anm-static') !== 'true') {
      tl.to(circles, { opacity: 0.3, filter: 'blur(0px)' }, '<+0.25')
    }

    if (trustLogos && section.querySelector('[anm-hero=trust-logos]').getAttribute('anm-static') !== 'true') {
      tl.to(trustLogos, { opacity: 1, filter: 'blur(0px)', stagger: 0.1 }, '<+0.25')
    }

    if (trustHeadline && trustHeadline.getAttribute('anm-static') !== 'true') {
      tl.to(trustHeadline, { opacity: 1, filter: 'blur(0px)' }, '<+0.25')
    }
  }

  return tl
}
