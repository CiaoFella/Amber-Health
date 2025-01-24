import { gsap, ScrollTrigger } from '../../vendor.js'

let ctx

function init() {
  const section = document.querySelector('[anm-footer=section]')

  if (section) {
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
  }
}

function cleanup() {
  ctx && ctx.revert()
}

export default {
  init,
  cleanup,
}
