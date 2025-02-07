import { gsap, ScrollTrigger } from '../../vendor.js'

let ctx

function init() {
  const section = document.querySelector('[anm-footer=section]')

  if (section) {
    const gradientWrap = section.querySelector('[anm-footer=gradient-wrap]')
    ctx = gsap.context(() => {
      const wrap = section.querySelector('[anm-footer=wrap]')
      const tagline = section.querySelector('[anm-footer=tagline]').children

      const tl = gsap.timeline({ defaults: { duration: 1.5, ease: 'power3.out' } })

      ScrollTrigger.create({
        trigger: section,
        animation: tl,
        start: 'top bottom',
        end: 'top 75%',
        toggleActions: 'none play none reset',
      })

      tl.fromTo(wrap, { y: '5rem', scale: 1.1 }, { y: 0, scale: 1 }).fromTo(
        tagline,
        { yPercent: 110, rotate: 10 },
        { yPercent: 0, stagger: -0.025, rotate: 0, ease: 'expo.out' },
        '<+0.25'
      )
    })

    if (gradientWrap) {
      const gradientContainer = gradientWrap.querySelector('[anm-footer=gradient-container]')
      const height = getComputedStyle(gradientContainer).height
      ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { duration: 3, ease: 'expo.out' } })

        tl.fromTo(gradientContainer, { height: 0, y: '10%' }, { height: height, y: '-10%' })

        ScrollTrigger.create({
          trigger: gradientWrap,
          animation: tl,
          start: 'top bottom',
          end: 'top 75%',
          toggleActions: 'none play none reset',
        })
      })
    }
  }
}

function cleanup() {
  ctx && ctx.revert()
}

export default {
  init,
  cleanup,
}
