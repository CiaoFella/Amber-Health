import { gsap, ScrollTrigger } from '../../vendor.js'

let ctx

function init() {
  const section = document.querySelector('[anm-research=section]')

  if (!section) return

  const scrollCircle = section.querySelector('[anm-research=scroll-circle]')
  const scrollRoller = section.querySelector('[anm-research=year-roller]')
  const circles = section.querySelectorAll('[anm-research=circle]')
  const researchItems = section.querySelectorAll('[anm-research=item]')

  ctx = gsap.context(() => {
    researchItems.forEach((researchItem) => {
      const content = researchItem.querySelector('[anm-research=content]')
      if (!content) return

      const tl = gsap.timeline({ defaults: { duration: 1.5, ease: 'expo.out' } })

      ScrollTrigger.create({
        trigger: researchItem,
        animation: tl,
        start: 'top bottom',
        end: 'top center',
        toggleActions: 'none play none none',
      })

      tl.from(content.children, { opacity: 0, rotate: 5, y: '10rem', stagger: 0.1, delay: 0.25 })
    })

    circles.forEach((circle) => {
      const year = circle.getAttribute('anm-year')
      if (!year || !scrollRoller) return

      const researchItem = circle.closest('[anm-research=item]')
      if (!researchItem) return

      const lastDigit = parseInt(year.slice(-1))

      gsap.to(scrollRoller, {
        scrollTrigger: {
          trigger: researchItem,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => updateYear(lastDigit),
          onEnterBack: () => updateYear(lastDigit),
        },
      })
    })
  }, section)

  function updateYear(digit) {
    gsap.to(scrollRoller, {
      y: `${-digit * 100}%`,
      duration: 1,
      ease: 'expo.out',
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
