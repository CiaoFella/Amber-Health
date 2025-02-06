import shared from '../animations/shared.js'
import teamList from '../animations/about/teamList.js'
function init() {
  shared.init()
  teamList.init()
}

function cleanup() {
  shared.cleanup()
  teamList.cleanup()
}

export default {
  init,
  cleanup,
}
