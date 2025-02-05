import researchModule from '../animations/research/researchModule.js'
import shared from '../animations/shared.js'

function init() {
  shared.init()
  researchModule.init()
}

function cleanup() {
  shared.cleanup()
  researchModule.cleanup()
}

export default {
  init,
  cleanup,
}
