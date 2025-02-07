import { gsap, ScrollTrigger } from '../../vendor.js'

let ctx

function init() {
  const sections = document.querySelectorAll('[anm-scroll-counter=section]')

  if (sections && sections.length > 0) {
    sections.forEach((section) => {
      if (handleAnimationDisable(section)) {
        return
      }

      const scroller = section.closest('[anm-scroller=scroller]') || window
      const counters = section.querySelectorAll('[anm-scroll-counter=counter]')
      const sectionStart = section.getAttribute('anm-start') || 'top center'
      const sectionEnd = section.getAttribute('anm-end') || 'bottom top'
      const counterScrub = section.getAttribute('anm-scrub')
      const scrubValue = isNaN(counterScrub) ? counterScrub === 'true' : parseFloat(counterScrub)
      const counterReset = section.getAttribute('anm-reset') || false

      const tl = gsap.timeline({
        defaults: { duration: 1, ease: 'power2.inOut' },
      })

      ScrollTrigger.create({
        animation: tl,
        trigger: section,
        scroller: scroller,
        start: counterReset === 'true' ? 'top bottom' : sectionStart,
        end: counterReset === 'true' ? sectionStart : sectionEnd,
        scrub: scrubValue,
        toggleActions: counterReset === 'true' ? 'none play none reset' : typeof scrubValue === 'boolean' ? null : 'play none none none',
      })

      counters.forEach((counter) => {
        const snap = counter.getAttribute('anm-snap') || 1
        const duration = counter.getAttribute('anm-duration') || 1
        const ease = counter.getAttribute('anm-ease') || 'power2.inOut'
        const delay = counter.getAttribute('anm-delay') || 0
        const start = counter.getAttribute('anm-counter-start') || '0'

        tl.from(counter, { textContent: start, snap: { textContent: snap }, duration: duration, ease: ease, delay: delay }, 0)
      })
    })

    function handleAnimationDisable(element) {
      const disableAttribute = element.getAttribute('anm-disable')
      if (!disableAttribute) return false

      const viewports = disableAttribute.split(',').map((v) => v.trim())

      const mediaQueries = {
        desktop: '(min-width: 992px)',
        tablet: '(min-width: 768px) and (max-width: 991px)',
        landscape: '(orientation: landscape) and (max-width: 767px)',
        mobile: '(max-width: 479px)',
      }

      const disableQueries = viewports.map((viewport) => mediaQueries[viewport]).filter(Boolean)

      if (disableQueries.length === 0) return false

      let isDisabled = false
      isDisabled = disableQueries.some((query) => window.matchMedia(query).matches)

      return isDisabled
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
