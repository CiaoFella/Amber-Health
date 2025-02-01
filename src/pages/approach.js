import shared from '../animations/shared.js'
import ourApproach from '../animations/approach/ourApproach.js'

function init() {
  shared.init()
  ourApproach.init()
}

function cleanup() {
  shared.cleanup()
  ourApproach.cleanup()
}

export default {
  init,
  cleanup,
}
