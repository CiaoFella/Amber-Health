import { gsap, SplitType, ScrollTrigger } from '../../vendor.js'
import locomotiveScroll from '../../utilities/smoothScroll.js'

let ctx

function init() {
  const teamListSection = document.querySelector('[anm-team-list=section]')
  const teamListItems = teamListSection.querySelectorAll('[anm-team-list=item]')

  if (!teamListSection) return

  const modalWrap = document.querySelector('[anm-team-modal=wrap]')
  const modalBg = document.querySelector('[anm-team-modal=bg]')
  const modalOuter = document.querySelector('[anm-team-modal=outer]')
  const modalList = document.querySelector('[anm-team-modal=list]')
  const modalItems = document.querySelectorAll('[anm-team-modal=item]')
  const triggers = document.querySelectorAll('[anm-team-modal=trigger]')
  const navButtons = document.querySelectorAll('[anm-team-modal=arrow]')

  const MODAL_ACTIVE_CLASS = 'is-modal-active'
  const ITEM_ACTIVE_CLASS = 'is-active'

  function splitTextIntoLines(element) {
    const paragraphs = element.querySelectorAll('p')
    paragraphs.forEach(function splitParagraph(p) {
      new SplitType(p, { types: 'lines' })
    })

    const allLines = element.querySelectorAll('.line')
    allLines.forEach(function setLineIndex(line, lineIndex) {
      line.style.setProperty('--line-index', lineIndex)
    })
  }

  function revertSplitText(element) {
    const paragraphs = element.querySelectorAll('p')
    paragraphs.forEach(function revertParagraph(p) {
      SplitType.revert(p)
    })
  }

  function closeModal() {
    const tl = gsap.timeline()
    tl.to(modalOuter, { opacity: 0, y: 20, duration: 0.3 }).to(
      modalBg,
      {
        opacity: 0,
        duration: 0.3,
        onComplete: function handleModalClose() {
          modalWrap.classList.remove(MODAL_ACTIVE_CLASS)
          modalItems.forEach(function resetItem(item) {
            item.classList.remove(ITEM_ACTIVE_CLASS)
            const text = item.querySelector('[anm-team-modal=text]')
            if (text) revertSplitText(text)
          })
          locomotiveScroll.start()
        },
      },
      '-=0.2'
    )
  }

  function navigateModal(direction) {
    const currentIndex = Array.from(modalItems).findIndex((item) => item.classList.contains(ITEM_ACTIVE_CLASS))
    let newIndex = currentIndex - direction

    newIndex = (newIndex + modalItems.length) % modalItems.length

    const overflowElement = document.querySelector('[data-lenis-prevent]')
    if (overflowElement) {
      overflowElement.scroll({ top: 0, behavior: 'smooth', immediate: true })
    }

    gsap.to(modalList, {
      x: `${newIndex * -100}%`,
      duration: 0.5,
      ease: 'power3.inOut',
      onComplete: () => {
        const prevItem = modalItems[currentIndex]
        const newItem = modalItems[newIndex]

        prevItem.classList.remove(ITEM_ACTIVE_CLASS)
        revertSplitText(prevItem.querySelector('[anm-team-modal=text]'))

        newItem.classList.add(ITEM_ACTIVE_CLASS)
        splitTextIntoLines(newItem.querySelector('[anm-team-modal=text]'))
      },
    })
  }

  ctx = gsap.context(function initializeContext() {
    modalWrap.classList.remove(MODAL_ACTIVE_CLASS)

    const scrollTl = gsap.timeline({ defaults: { duration: 1, ease: 'power3.out' } })

    scrollTl.from(teamListItems, {
      y: '5rem',
      stagger: 0.05,
      opacity: 0,
    })

    ScrollTrigger.create({
      trigger: teamListSection,
      animation: scrollTl,
      start: 'top bottom',
      end: 'top 75%',
      toggleActions: 'none play none reset',
    })

    function openModal(index) {
      locomotiveScroll.stop()

      modalItems.forEach((item) => item.classList.remove(ITEM_ACTIVE_CLASS))
      modalItems[index].classList.add(ITEM_ACTIVE_CLASS)

      modalWrap.classList.add(MODAL_ACTIVE_CLASS)

      const activeText = modalItems[index].querySelector('[anm-team-modal=text]')
      splitTextIntoLines(activeText)

      const tl = gsap.timeline()
      tl.fromTo(modalBg, { opacity: 0 }, { opacity: 1, duration: 0.3 }).fromTo(modalOuter, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.3 }, '-=0.2')

      gsap.set(modalList, {
        x: `${index * -100}%`,
      })
    }

    triggers.forEach((trigger, index) => {
      trigger.addEventListener('click', () => openModal(index))
    })

    teamListItems.forEach((item, index) => {
      item.addEventListener('click', () => openModal(index))
    })

    modalBg.addEventListener('click', closeModal)

    document.addEventListener('keydown', (e) => {
      const isModalOpen = modalWrap.classList.contains(MODAL_ACTIVE_CLASS)

      if (e.key === 'Escape' && isModalOpen) {
        closeModal()
      }
      if (isModalOpen) {
        if (e.key === 'ArrowLeft') {
          navigateModal(1)
        } else if (e.key === 'ArrowRight') {
          navigateModal(-1)
        }
      }
    })

    navButtons.forEach(function setupNavButton(button) {
      button.addEventListener('click', function handleNavClick() {
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
