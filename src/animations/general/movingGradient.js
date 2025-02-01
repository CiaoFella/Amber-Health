import { gsap } from '../../vendor.js'
import { cursor } from '../../utilities/customCursor/customCursor.js'

let ctx
let moveTimeout

function init() {
  const containers = document.querySelectorAll('.moving_gradients_container')
  if (containers.length === 0) return

  containers.forEach((container) => {
    ctx = gsap.ticker.add(() => move(container))
  })

  function move(container) {
    const interBubble = container.querySelector('.moving_gradient_interactive')
    const moveX = gsap.quickTo(interBubble, 'left', { duration: 0.5, ease: 'power2.out' })
    const moveY = gsap.quickTo(interBubble, 'top', { duration: 0.5, ease: 'power2.out' })

    if (cursor && cursor.pos) {
      const containerRect = container.getBoundingClientRect()
      const relativeX = cursor.pos.x - containerRect.left
      const relativeY = cursor.pos.y - containerRect.top

      if (relativeX >= 0 && relativeX <= containerRect.width && relativeY >= 0 && relativeY <= containerRect.height) {
        moveX(relativeX)
        moveY(relativeY)

        cursor.el.classList.add('-hidden')
        clearTimeout(moveTimeout)
        moveTimeout = setTimeout(() => {
          cursor.el.classList.remove('-hidden')
        }, 100)
      }
    }
  }
}

function cleanup() {
  ctx && ctx.revert()
  clearTimeout(moveTimeout)
  if (cursor && cursor.el) {
    cursor.el.classList.remove('-hidden')
  }
}

export default {
  init,
  cleanup,
}
