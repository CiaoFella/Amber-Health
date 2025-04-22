import { gsap, ScrollTrigger } from '../vendor.js'
import { isDesktop, isLandscape, isMobile, isTablet } from './variables.js'

export function unwrapSpanAndPreserveClasses(element) {
  // Select all span elements inside the given element
  const spans = element.querySelectorAll('span')

  // Iterate over each span
  spans.forEach((span) => {
    // Get the class list of the span
    const spanClasses = span.className

    // Create a document fragment to hold the new elements
    const fragment = document.createDocumentFragment()

    // Iterate over child nodes to preserve <br> elements
    span.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        // Split the text content into words
        const words = node.textContent.split(/\s+/)

        words.forEach((word, index) => {
          // Create a new span for each word
          const newSpan = document.createElement('span')
          newSpan.textContent = word

          // Add the original span's classes to the new span
          if (spanClasses) {
            newSpan.className = spanClasses
          }

          // Append the new span and a space after the word (if it's not the last word)
          fragment.appendChild(newSpan)
          if (index < words.length - 1) {
            fragment.appendChild(document.createTextNode(' '))
          }
        })
      } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'BR') {
        // Preserve <br> elements
        fragment.appendChild(node.cloneNode())
      }
    })

    // Replace the original span with the new fragment
    span.replaceWith(fragment)
  })
}

export function closeMenu() {
  const menuTrigger = document.querySelector('[data-menu-mobile=trigger]')

  if (menuTrigger.classList.contains('is-active')) {
    menuTrigger.click()
  }
}

export function getCurrentPage() {
  const currentPage = document.querySelector('[data-barba="container"]').dataset.barbaNamespace

  return currentPage
}

let mm

export function handleResponsiveElements() {
  if (mm) {
    mm.revert()
  }

  mm = gsap.matchMedia()

  const removedElementsMap = new Map()

  mm.add(isTablet, () => {
    handleElementRemoval('tablet')
  })

  mm.add(isLandscape, () => {
    handleElementRemoval('landscape')
  })

  mm.add(isMobile, () => {
    handleElementRemoval('mobile')
  })

  mm.add(isDesktop, () => {
    return () => {}
  })

  function handleElementRemoval(breakpoint) {
    document.querySelectorAll('[data-remove]').forEach((el) => {
      const removeAt = el.getAttribute('data-remove') // e.g., "tablet", "landscape", "mobile"
      const parent = el.parentNode
      const nextSibling = el.nextElementSibling

      if (removeAt === breakpoint) {
        if (!removedElementsMap.has(el)) {
          removedElementsMap.set(el, { parent, nextSibling })
          parent.removeChild(el)
        }
      }
    })
  }
}

export function updateCurrentNavLink() {
  const currentPath = window.location.pathname

  document.querySelectorAll('a').forEach((link) => {
    const href = link.getAttribute('href')

    if (href === currentPath || href === currentPath + '/') {
      link.classList.add('w--current') // Webflow uses 'w--current' for the 'current' class
    } else {
      link.classList.remove('w--current')
    }
  })
}

export function disableAllFirstOptions() {
  const selectElements = document.querySelectorAll('.w-select')

  selectElements.forEach((select) => {
    select.style.color = 'unset'
    const firstOption = select.querySelector('option:first-child')
    if (firstOption) {
      firstOption.disabled = true
    }

    select.addEventListener('change', () => {
      select.style.color = 'var(--swatch--dark)'
    })
  })
}

export function closeAllDropdowns() {
  document.querySelectorAll('.w-dropdown').forEach((dropdown) => {
    dropdown.querySelectorAll('.w--open').forEach((openElement) => {
      openElement.classList.remove('w--open')
    })
  })
}

export function initDropdownHoverBehavior() {
  const dropdowns = document.querySelectorAll('.w-dropdown[data-hover="true"]')

  dropdowns.forEach((dropdown) => {
    const toggle = dropdown.querySelector('.w-dropdown-toggle')
    const list = dropdown.querySelector('.w-dropdown-list')
    let closeTimeout = null

    // Mouse enter dropdown wrapper
    dropdown.addEventListener('mouseenter', () => {
      if (closeTimeout) {
        clearTimeout(closeTimeout)
        closeTimeout = null
      }
      toggle.setAttribute('aria-expanded', 'true')
      list.classList.add('w--open')
    })

    // Mouse leave dropdown wrapper
    dropdown.addEventListener('mouseleave', () => {
      closeTimeout = setTimeout(() => {
        toggle.setAttribute('aria-expanded', 'false')
        list.classList.remove('w--open')
      }, 500) // 500ms delay
    })
  })
}

export function reinitializeScripts(container) {
  // Find all script tags within the provided container
  const scripts = container.querySelectorAll('script')

  scripts.forEach((script) => {
    // Prioritize scripts with 'src'. Handle others cautiously.
    // You might need to refine the conditions based on specific inline scripts.
    if (script.src /* || script.id === 'specific-inline-id' */) {
      const newScript = document.createElement('script')

      // Copy all attributes from the original script to the new one
      script.getAttributeNames().forEach((attrName) => {
        const attrValue = script.getAttribute(attrName)
        newScript.setAttribute(attrName, attrValue)
      })

      // If it's an inline script (no src), copy its content
      // Use this carefully, as re-executing inline scripts can be problematic
      if (!script.src) {
        newScript.textContent = script.textContent
      }

      // Append the new script to the document's head to execute it.
      // Appending to head is common, but body also works.
      document.head.appendChild(newScript)

      // Optional: Remove the new script element after it has presumably executed
      // This can prevent clutter but adds slight complexity.
      // if (newScript.src) { // Only for external scripts
      //   newScript.onload = () => setTimeout(() => newScript.remove(), 0);
      // } else { // For inline scripts, remove immediately
      //   setTimeout(() => newScript.remove(), 0);
      // }

      // Optional: Remove the original script from the barba container
      // Prevents potential issues if the container is ever re-parsed
      // script.remove();
    }
  })
}
