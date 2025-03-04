import shared from '../animations/shared.js'
import serviceOverview from '../animations/shared/serviceOverview.js'

function init() {
  shared.init()
  serviceOverview.init()
}

function cleanup() {
  shared.cleanup()
  serviceOverview.cleanup()
}

export default {
  init,
  cleanup,
}
