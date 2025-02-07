import { gsap, SplitType } from '../../vendor.js'
import locomotiveScroll from '../../utilities/smoothScroll.js'

let ctx

function init() {
  const modalWrap = document.querySelector('[anm-team-modal=wrap]')
  const modalBg = document.querySelector('[anm-team-modal=bg]')
  const modalOuter = document.querySelector('[anm-team-modal=outer]')
  const modalList = document.querySelector('[anm-team-modal=list]')
  const modalItems = document.querySelectorAll('[anm-team-modal=item]')
  const triggers = document.querySelectorAll('[anm-team-modal=trigger]')
  const navButtons = document.querySelectorAll('[anm-team-modal=arrow]')

  // Add function to handle modal closing
  const closeModal = () => {
    const tl = gsap.timeline()
    tl.to(modalOuter, { opacity: 0, y: 20, duration: 0.3 }).to(
      modalBg,
      {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          gsap.set(modalWrap, { display: 'none' })
          modalItems.forEach((item) => {
            item.classList.remove('is-active')
            const text = item.querySelector('[anm-team-modal=text]')
            if (text) {
              const paragraphs = text.querySelectorAll('p')
              paragraphs.forEach((p) => {
                SplitType.revert(p)
              })
            }
          })
          // Start locomotive scroll
          locomotiveScroll.start()
        },
      },
      '-=0.2'
    )
  }

  // Add function to handle navigation
  const navigateModal = (direction) => {
    const currentIndex = Array.from(modalItems).findIndex((item) => item.classList.contains('is-active'))
    let newIndex = currentIndex - direction
    if (newIndex < 0) {
      newIndex = modalItems.length - 1
    } else if (newIndex >= modalItems.length) {
      newIndex = 0
    }

    // Scroll the overflow element to top
    const overflowElement = document.querySelector('[data-lenis-prevent]')
    if (overflowElement) {
      overflowElement.scroll({ top: 0, behavior: 'smooth', immediate: true })
    }

    const newX = newIndex * -100

    // First animate the slide
    gsap.to(modalList, {
      x: `${newX}%`,
      duration: 0.5,
      ease: 'power3.inOut',
      onComplete: () => {
        // Only after the slide is complete, handle the text transition
        modalItems[currentIndex].classList.remove('is-active')

        // Revert split text for previous item
        const prevText = modalItems[currentIndex].querySelector('[anm-team-modal=text]')
        const prevParagraphs = prevText.querySelectorAll('p')
        prevParagraphs.forEach((p) => {
          SplitType.revert(p)
        })

        // Setup new item
        modalItems[newIndex].classList.add('is-active')
        const activeText = modalItems[newIndex].querySelector('[anm-team-modal=text]')
        const paragraphs = activeText.querySelectorAll('p')
        paragraphs.forEach((p) => {
          new SplitType(p, {
            types: 'lines',
          })
        })

        // Set line indices after splitting
        const allLines = activeText.querySelectorAll('.line')
        allLines.forEach((line, lineIndex) => {
          line.style.setProperty('--line-index', lineIndex)
        })
      },
    })
  }

  ctx = gsap.context(() => {
    gsap.set(modalWrap, { display: 'none' })

    triggers.forEach((trigger, index) => {
      trigger.addEventListener('click', () => {
        // Stop locomotive scroll
        locomotiveScroll.stop()

        modalItems.forEach((item) => item.classList.remove('is-active'))
        modalItems[index].classList.add('is-active')

        const activeText = modalItems[index].querySelector('[anm-team-modal=text]')
        const paragraphs = activeText.querySelectorAll('p')

        gsap.set(modalWrap, { display: 'flex' })

        paragraphs.forEach((p) => {
          new SplitType(p, {
            types: 'lines',
          })
        })

        // Add this: Set line indices after splitting
        const allLines = activeText.querySelectorAll('.line')
        allLines.forEach((line, lineIndex) => {
          line.style.setProperty('--line-index', lineIndex)
        })

        const tl = gsap.timeline()
        tl.fromTo(modalBg, { opacity: 0 }, { opacity: 1, duration: 0.3 }).fromTo(modalOuter, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.3 }, '-=0.2')

        gsap.set(modalList, {
          x: `${index * -100}%`,
        })
      })
    })

    // Update modal background click to use closeModal function
    modalBg.addEventListener('click', closeModal)

    // Add escape key listener
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalWrap.style.display === 'flex') {
        closeModal()
      }
      // Add arrow key navigation
      if (modalWrap.style.display === 'flex') {
        if (e.key === 'ArrowLeft') {
          navigateModal(1)
        } else if (e.key === 'ArrowRight') {
          navigateModal(-1)
        }
      }
    })

    // Update navigation buttons to use navigateModal function
    navButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const direction = button.classList.contains('is-left') ? 1 : -1
        navigateModal(direction)
      })
    })
  })
}

function cleanup() {
  ctx && ctx.revert()
}

export default {
  init,
  cleanup,
}
