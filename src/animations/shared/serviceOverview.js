import { gsap } from '../../vendor.js'

let ctx

function init() {
  const sections = document.querySelectorAll('[anm-service-overview=section]')
  if (sections.length === 0) return

  ctx = gsap.context(() => {
    sections.forEach((section) => {
      const listItems = section.querySelector('[anm-service-overview=list-wrap]').children
      const bgItems = section.querySelector('[anm-service-overview=bg-wrap]').children

      gsap.set(bgItems, {
        opacity: 0,
        scale: 1.1,
      })
      gsap.set(listItems, {
        opacity: 0.5,
      })

      gsap.set(bgItems[0], {
        opacity: 1,
        scale: 1,
      })
      gsap.set(listItems[0], {
        opacity: 1,
      })

      Array.from(listItems).forEach((item, index) => {
        item.addEventListener('mouseenter', () => {
          gsap.to(bgItems, {
            opacity: 0,
            scale: 1.1,
            duration: 0.5,
            ease: 'power3.inOut',
          })
          gsap.to(listItems, {
            opacity: 0.5,
            duration: 0.5,
            ease: 'power3.inOut',
          })

          gsap.to(bgItems[index], {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            ease: 'power3.inOut',
          })
          gsap.to(item, {
            opacity: 1,
            duration: 0.5,
            ease: 'power3.inOut',
          })
        })
      })
    })
  })
}

function cleanup() {
  ctx && ctx.revert()
}

export default {
  init,
  cleanup,
}
