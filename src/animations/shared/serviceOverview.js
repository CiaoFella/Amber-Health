import { fullClipPath, topClipPath } from '../../utilities/variables.js'
import { gsap, ScrollTrigger, Flip } from '../../vendor.js'

let ctx

function init() {
  const sections = document.querySelectorAll('[anm-service-overview=section]')
  if (sections.length === 0) return

  ctx = gsap.context(() => {
    sections.forEach((section) => {
      const listItems = section.querySelector('[anm-service-overview=list-wrap]').children
      const bgItems = section.querySelector('[anm-service-overview=bg-wrap]').children
      const headlines = section.querySelectorAll('[anm-service-overview=headline]')

      const scrollTl = gsap.timeline({ defaults: { duration: 1.5, ease: 'expo.out' } })

      gsap.set(headlines, { opacity: 0.5 })
      gsap.set(headlines[0], { opacity: 1 })

      scrollTl.fromTo(headlines, { rotate: 10, y: '20rem', clipPath: topClipPath }, { rotate: 0, y: '0rem', clipPath: fullClipPath, stagger: 0.1 })

      ScrollTrigger.create({
        trigger: section,
        animation: scrollTl,
        start: 'top bottom',
        end: 'top 75%',
        toggleActions: 'none play none none',
      })

      const brandCircles = section.querySelectorAll('[anm-service-overview=brand-circle]')
      const firstBrandCircle = brandCircles[0]
      brandCircles.forEach((circle, index) => {
        if (index !== 0) circle.remove()
      })

      const firstListItem = listItems[0]
      firstListItem.appendChild(firstBrandCircle)

      Array.from(listItems).forEach((item) => {
        item.addEventListener('mouseenter', () => {
          const serviceName = item.getAttribute('anm-service-item')
          const itemHeadline = item.querySelector('[anm-service-overview=headline]')
          const matchingBgItem = Array.from(bgItems).find((bg) => bg.getAttribute('anm-service-item') === serviceName)

          const state = Flip.getState(firstBrandCircle)

          item.appendChild(firstBrandCircle)

          Flip.from(state, {
            duration: 0.75,
            ease: 'expo.out',
          })

          gsap.to(bgItems, {
            opacity: 0,
            scale: 1.05,
            duration: 0.75,
            ease: 'expo.inOut',
          })
          gsap.to(headlines, {
            opacity: 0.5,
            duration: 0.5,
            ease: 'power3.inOut',
          })

          gsap.fromTo(
            matchingBgItem,
            {
              opacity: 0,
              rotate: 20,
              scale: 1.05,
              transformOrigin: 'bottom left',
            },
            {
              opacity: 1,
              rotate: 0,
              scale: 1,
              duration: 1,
              ease: 'expo.inOut',
            }
          )
          gsap.to(itemHeadline, {
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
