import { gsap, ScrollTrigger } from '../../../vendor.js'

let ctx

function init() {
  const lists = document.querySelectorAll('[anm-offers="list"]')

  if (lists.length > 0) {
    lists.forEach((list) => {
      const items = list.querySelectorAll('[anm-offers="item"]')

      const tl = gsap.timeline({ defaults: { duration: 1, ease: 'expo.out' } })

      tl.from(items, { opacity: 0, rotate: 5, yPercent: 50, stagger: 0.1 })

      ScrollTrigger.create({
        trigger: list,
        animation: tl,
        start: 'top bottom',
        end: 'top 75%',
        toggleActions: 'none play none none',
      })
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
