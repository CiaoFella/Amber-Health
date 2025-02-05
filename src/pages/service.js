import shared from '../animations/shared.js'
import ourApproach from '../animations/approach/ourApproach.js'
import offers from '../animations/service/offers.js'
import serviceOverview from '../animations/shared/serviceOverview.js'
import serviceDetailOverview from '../animations/service/serviceDetailOverview.js'

function init() {
  shared.init()
  offers.init()
  serviceDetailOverview.init()
  serviceOverview.init()
}

function cleanup() {
  shared.cleanup()
  offers.cleanup()
  serviceDetailOverview.cleanup()
  serviceOverview.cleanup()
}

export default {
  init,
  cleanup,
}
