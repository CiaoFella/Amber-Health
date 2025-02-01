import { topClipPath, fullClipPath, isDesktop, isTablet } from '../../utilities/variables.js'
import { gsap, ScrollTrigger, SplitType } from '../../vendor.js'

let context

const mm = gsap.matchMedia()

function init() {}

function cleanup() {
  context && context.revert()
}

export default {
  init,
  cleanup,
}
