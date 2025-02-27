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
      gsap.set(bgItems, { opacity: 0 })
      gsap.set(bgItems[0], { opacity: 1 })

      scrollTl.fromTo(headlines, { filter: 'blur(10px)' }, { filter: 'blur(0px)', stagger: 0.1 })

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

      // Create a timeline for background transitions
      let currentBgTl

      Array.from(listItems).forEach((item) => {
        item.addEventListener('mouseenter', () => {
          if (item.contains(firstBrandCircle)) return

          const serviceName = item.getAttribute('anm-service-item')
          const itemHeadline = item.querySelector('[anm-service-overview=headline]')
          const matchingBgItem = Array.from(bgItems).find((bg) => bg.getAttribute('anm-service-item') === serviceName)

          // Kill previous timeline if it exists
          if (currentBgTl) currentBgTl.kill()

          const state = Flip.getState(firstBrandCircle)
          item.appendChild(firstBrandCircle)

          Flip.from(state, {
            duration: 0.75,
            ease: 'expo.out',
          })

          // Create new timeline for background transition
          currentBgTl = gsap
            .timeline()
            .to(bgItems, {
              opacity: 0,
              scale: 1.05,
              duration: 0.75,
              filter: 'blur(10px)',
              ease: 'expo.inOut',
            })
            .to(
              headlines,
              {
                opacity: 0.5,
                duration: 0.5,
                ease: 'power3.inOut',
              },
              '<'
            )
            .fromTo(
              matchingBgItem,
              {
                opacity: 0,
                scale: 1.05,
                filter: 'blur(10px)',
              },
              {
                opacity: 1,
                scale: 1,
                duration: 1,
                ease: 'expo.inOut',
                filter: 'blur(0px)',
              },
              '<'
            )
            .to(
              itemHeadline,
              {
                opacity: 1,
                duration: 0.5,
                ease: 'power3.inOut',
              },
              '<'
            )
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
