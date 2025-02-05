import movingGradient from './general/movingGradient.js'
import footer from './general/footer.js'
import navBar from './general/navBar.js'
import bgGradient from './shared/bgGradient.js'
import buttons from './shared/buttons.js'
import elementReveal from './shared/elementReveal.js'
import hero from './shared/hero.js'

import textReveal from './shared/textReveal.js'

function init() {
  hero.init()
  footer.init()
  bgGradient.init()
  textReveal.init()
  elementReveal.init()
  buttons.init()
  navBar.init()
  movingGradient.init()
}

function cleanup() {
  hero.cleanup()
  footer.cleanup()
  bgGradient.cleanup()
  textReveal.cleanup()
  elementReveal.cleanup()
  navBar.cleanup()
  movingGradient.cleanup()
}

export default {
  init,
  cleanup,
}
