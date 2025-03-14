import shared from '../animations/shared.js'
import ourApproach from '../animations/approach/ourApproach.js'
import serviceOverview from '../animations/shared/serviceOverview.js'

function init() {
  shared.init()
  ourApproach.init()
  serviceOverview.init()
}

function cleanup() {
  shared.cleanup()
  ourApproach.cleanup()
  serviceOverview.cleanup()
}

export default {
  init,
  cleanup,
}
