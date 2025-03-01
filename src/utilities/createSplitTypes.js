import { SplitType, gsap } from '../vendor.js'
import { isLandscape } from './variables.js'

let SplitTypes = []
const mm = gsap.matchMedia()

function init() {
  mm.add(`(not ${isLandscape})`, () => {
    // Only create split types on viewports larger than landscape
    const splitTypes = document.querySelectorAll('[data-split-type]')
    if (splitTypes && splitTypes.length > 0) {
      splitTypes.forEach((splitType) => {
        if (splitType.getAttribute('anm-static') === 'true') return

        const type = splitType.dataset.splitType || 'lines'
        SplitTypes.push(new SplitType(splitType, { types: type }))
      })
    }
  })
}

function cleanup() {
  SplitTypes.forEach((SplitType) => {
    SplitType.revert(SplitType.elements)
  })

  // Clean up matchMedia context when done
  mm.revert()
}

export default {
  init,
  cleanup,
}
