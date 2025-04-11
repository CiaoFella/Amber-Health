import footer from './general/footer.js'
import navBar from './general/navBar.js'
import bgGradient from './shared/bgGradient.js'
import buttons from './shared/buttons.js'
import elementReveal from './shared/elementReveal.js'
import hero from './shared/hero.js'
import textReveal from './shared/textReveal.js'
import marquee from './general/marquee.js'
import counter from './shared/counter.js'
import targetReveal from './general/targetReveal.js'

function init() {
  hero.init()
  footer.init()
  bgGradient.init()
  textReveal.init()
  elementReveal.init()
  buttons.init()
  navBar.init()
  marquee.init()
  counter.init()
  targetReveal.init()
}

function cleanup() {
  hero.cleanup()
  footer.cleanup()
  bgGradient.cleanup()
  textReveal.cleanup()
  elementReveal.cleanup()
  navBar.cleanup()
  marquee.cleanup()
  counter.cleanup()
  targetReveal.cleanup()
}

export default {
  init,
  cleanup,
}
