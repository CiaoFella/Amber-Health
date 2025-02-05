import { gsap } from '../../vendor.js'

let ctx

function init() {
  const serviceOverview = document.querySelector('[anm-service-overview]')

  if (serviceOverview) {
    // Get the headline text
    const headlineText = document.querySelector('[anm-service=headline]')?.textContent?.trim()

    if (headlineText) {
      const overviewItems = document.querySelector('[anm-service-overview=list-wrap]').children
      const matchingItem = Array.from(overviewItems).find((item) => item.getAttribute('anm-service-item') === headlineText)

      if (matchingItem) {
        matchingItem.remove()

        const bgWrappers = document.querySelector('[anm-service-overview=bg-wrap]').children
        const matchingVisual = Array.from(bgWrappers).find((visual) => visual.getAttribute('anm-service-item') === headlineText)
        matchingVisual?.remove()

        if (overviewItems[0]) {
          gsap.set(overviewItems[0], { opacity: 1 })
          const firstBgItem = Array.from(bgWrappers).find((visual) => visual.getAttribute('anm-service-item') === overviewItems[0].getAttribute('anm-service-item'))
          gsap.set(firstBgItem, { opacity: 1, scale: 1 })
        }
      }
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
