import { gsap, ScrollTrigger } from '../../vendor.js'
import { fullClipPath, topClipPath } from '../../utilities/variables.js'

let scrollTrigger
let scrollTriggers = []

function init() {
  const navbar = document.querySelector('[anm-navbar=wrap]')
  const dropdown = document.querySelector('[anm-navbar=dropdown]')
  const dropdownTrigger = document.querySelector('[anm-navbar=dropdown-trigger]')
  const menuTrigger = document.querySelector('[anm-navbar=menu-trigger]')
  const flyoutWrap = document.querySelector('[anm-flyout=wrap]')
  if (!navbar) return

  const heroSection = document.querySelector('[anm-hero=section]')
  if (heroSection) {
    const heroBg = heroSection.querySelector('[anm-hero=bg]')
    navbar.setAttribute('data-theme', heroBg ? 'dark' : 'light')
  }

  if (dropdownTrigger && dropdown) {
    dropdown.querySelectorAll('[anm-navbar=dropdown-item]').forEach((item, index) => {
      item.style.setProperty('--item-index', index)
    })

    let isDropdownHovered = false
    let isTriggerHovered = false

    dropdownTrigger.addEventListener('mouseenter', () => {
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

    dropdownTrigger.addEventListener('mouseleave', () => {
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
  }

  // Add click handler for mobile menu
  if (menuTrigger && flyoutWrap) {
    const menuItems = flyoutWrap.querySelectorAll('[anm-flyout="menu"] > *')

    menuTrigger.addEventListener('click', () => {
      if (flyoutWrap.classList.contains('is-active')) {
        // Menu is being closed
        menuTrigger.classList.remove('is-active')
        flyoutWrap.classList.remove('is-active')
      } else {
        // Menu is being opened
        menuTrigger.classList.add('is-active')
        flyoutWrap.classList.add('is-active')

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
      }
    })
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

function cleanup() {
  scrollTrigger && scrollTrigger.revert()
  scrollTriggers.forEach((cleanup) => cleanup())
  scrollTriggers = []
}

export default {
  init,
  cleanup,
}
