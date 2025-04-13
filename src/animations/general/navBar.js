import { gsap, ScrollTrigger } from '../../vendor.js'
import { fullClipPath, topClipPath } from '../../utilities/variables.js'

let scrollTrigger
let scrollTriggers = []
let menuItems = null
let menuTriggerListener = null

function init() {
  const navbar = document.querySelector('[anm-navbar=wrap]')
  const dropdownTriggers = document.querySelectorAll('[anm-navbar=dropdown-trigger]')
  const menuTrigger = document.querySelector('[anm-navbar=menu-trigger]')
  const flyoutWrap = document.querySelector('[anm-flyout=wrap]')
  if (!navbar) return

  // Reset menuItems reference
  menuItems = null

  const heroSection = document.querySelector('[anm-hero=section]')
  if (heroSection) {
    const heroBg = heroSection.querySelector('[anm-hero=bg]')
    navbar.setAttribute('data-theme', heroBg ? 'dark' : 'light')
  }

  // Handle multiple dropdowns
  dropdownTriggers.forEach((trigger) => {
    const dropdownId = trigger.getAttribute('data-dropdown')
    const dropdown = document.querySelector(`[anm-navbar=dropdown][data-dropdown="${dropdownId}"]`)

    if (!dropdown) return

    dropdown.querySelectorAll('[anm-navbar=dropdown-item]').forEach((item, index) => {
      item.style.setProperty('--item-index', index)
    })

    let isDropdownHovered = false
    let isTriggerHovered = false

    trigger.addEventListener('mouseenter', () => {
      isTriggerHovered = true
      dropdown.classList.add('is-open')
      navbar.classList.add('is-scrolled')
    })

    dropdown.addEventListener('mouseenter', () => {
      isDropdownHovered = true
    })

    dropdown.addEventListener('mouseleave', () => {
      isDropdownHovered = false
      if (!isTriggerHovered) {
        dropdown.classList.remove('is-open')
        if (scrollTrigger && scrollTrigger.progress === 0) {
          navbar.classList.remove('is-scrolled')
        }
      }
    })

    trigger.addEventListener('mouseleave', () => {
      isTriggerHovered = false
      setTimeout(() => {
        if (!isDropdownHovered) {
          dropdown.classList.remove('is-open')
          if (scrollTrigger && scrollTrigger.progress === 0) {
            navbar.classList.remove('is-scrolled')
          }
        }
      }, 100)
    })
  })

  if (menuTrigger && flyoutWrap) {
    // Update menuItems reference
    menuItems = flyoutWrap.querySelectorAll('[anm-flyout="menu"] > *')

    // Remove old listener if it exists
    if (menuTriggerListener) {
      menuTrigger.removeEventListener('click', menuTriggerListener)
    }

    // Create and store new listener
    menuTriggerListener = () => toggleFlyout()
    menuTrigger.addEventListener('click', menuTriggerListener)
  }

  scrollTrigger = ScrollTrigger.create({
    start: 'top+=50 top',
    onUpdate: (self) => {
      if (self.direction === -1 && self.progress === 0) {
        navbar.classList.remove('is-scrolled')
      } else if (self.direction === 1 && self.progress > 0) {
        navbar.classList.add('is-scrolled')
      }

      // Handle navbar hide/show
      if (self.direction === 1 && self.progress > 0) {
        navbar.classList.add('is-hidden')
      } else if (self.direction === -1) {
        navbar.classList.remove('is-hidden')
      }
    },
  })
}

function toggleFlyout(forceState) {
  const flyoutWrap = document.querySelector('[anm-flyout=wrap]')
  const menuTrigger = document.querySelector('[anm-navbar=menu-trigger]')
  const menuRoller = document.querySelector('[anm-navbar=menu-roller]')
  const navbar = document.querySelector('[anm-navbar=wrap]')
  if (!flyoutWrap || !menuTrigger) return

  // Get fresh reference to menuItems if not already set
  if (!menuItems) {
    menuItems = flyoutWrap.querySelectorAll('[anm-flyout="menu"] > *')
  }

  const shouldOpen = forceState !== undefined ? forceState : !flyoutWrap.classList.contains('is-active')

  if (shouldOpen) {
    menuTrigger.classList.add('is-active')
    menuRoller.classList.add('is-active')
    flyoutWrap.classList.add('is-active')
    navbar.setAttribute('data-theme', 'light')

    gsap.fromTo(
      menuItems,
      {
        opacity: 0,
        y: '2rem',
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power3.out',
        stagger: 0.1,
        delay: 0.25,
      }
    )
  } else {
    menuTrigger.classList.remove('is-active')
    menuRoller.classList.remove('is-active')
    flyoutWrap.classList.remove('is-active')

    // Restore original theme based on hero section
    const heroSection = document.querySelector('[anm-hero=section]')
    if (heroSection) {
      const heroBg = heroSection.querySelector('[anm-hero=bg]')
      navbar.setAttribute('data-theme', heroBg ? 'dark' : 'light')
    }
  }
}

function cleanup() {
  scrollTrigger && scrollTrigger.revert()
  scrollTriggers.forEach((cleanup) => cleanup())
  scrollTriggers = []

  // Clean up menu trigger listener
  const menuTrigger = document.querySelector('[anm-navbar=menu-trigger]')
  if (menuTrigger && menuTriggerListener) {
    menuTrigger.removeEventListener('click', menuTriggerListener)
    menuTriggerListener = null
  }

  menuItems = null
}

export default {
  init,
  cleanup,
  toggleFlyout,
}
