import { gsap, LocomotiveScroll, ScrollTrigger } from './vendor.js'
import barba from './barba.js'
import menu from './animations/general/menu.js'
import pageLoader from './animations/general/pageLoader.js'
import { getCurrentPage, handleResponsiveElements, updateCurrentNavLink } from './utilities/helper.js'
import createSplitTypes from './utilities/createSplitTypes.js'
import lenis, { createSmoothScroll } from './utilities/smoothScroll.js'
import handlePageEnterAnimation from './animations/general/handlePageEnter.js'
import { cursor, magneticCursor } from './utilities/customCursor/customCursor.js'
import { isDesktop } from './utilities/variables.js'
import { proxy } from './utilities/pageReadyListener.js'

gsap.registerPlugin(ScrollTrigger)
menu.init()

const mm = gsap.matchMedia()

let currentAnimationModule = null

function cleanupCurrentModule() {
  if (currentAnimationModule && currentAnimationModule.cleanup) {
    currentAnimationModule.cleanup()
  }

  ScrollTrigger.getAll().forEach((trigger) => trigger.kill())

  currentAnimationModule = null
}
function getBaseUrl() {
  const script = document.querySelector('script[src*="main.js"]')
  const scriptSrc = script?.src || ''
  const baseUrl = scriptSrc.substring(0, scriptSrc.lastIndexOf('/') + 1)
  return baseUrl
}

function loadPageModule(pageName) {
  const baseUrl = getBaseUrl()
  import(/* webpackIgnore: true */ `${baseUrl}pages/${pageName}.js`)
    .then((module) => {
      currentAnimationModule = module.default || {}
      // console.log(`${baseUrl}pages/${pageName}.js`)
      if (typeof currentAnimationModule.init === 'function') {
        currentAnimationModule.init()
      } else {
        console.warn(`Module for page ${pageName} does not have an init function.`)
      }
    })
    .catch((err) => {
      console.error(`Failed to load module for page: ${pageName}`, err)
      currentAnimationModule = {} // Set to an empty object to avoid further errors
    })
}

// Load the initial page module
const initialPageName = document.querySelector('[data-barba="container"]').dataset.barbaNamespace
createSplitTypes.init()
loadPageModule(initialPageName)
pageLoader.init(initialPageName)
handleResponsiveElements()
mm.add(isDesktop, () => {
  cursor.init()
  magneticCursor()
})
document.addEventListener('onPageReady', (event) => {
  if (event.detail === true) {
    handlePageEnterAnimation(getCurrentPage()).play()
  }
})
proxy.pageReady = true

barba.hooks.beforeEnter(() => {
  createSplitTypes.cleanup()
})

barba.hooks.afterEnter(() => {
  cleanupCurrentModule()
})

barba.hooks.after((data) => {
  const pageName = data.next.namespace
  updateCurrentNavLink()
  loadPageModule(pageName)
  handleResponsiveElements()
  createSmoothScroll()
})
