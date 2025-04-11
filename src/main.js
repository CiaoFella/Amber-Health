import { gsap, LocomotiveScroll, ScrollTrigger } from './vendor.js'
import barba from './barba.js'
import menu from './animations/general/menu.js'
import preloader from './animations/general/preloader.js'
import { disableAllFirstOptions, getCurrentPage, handleResponsiveElements, updateCurrentNavLink, initDropdownHoverBehavior } from './utilities/helper.js'
import createSplitTypes from './utilities/createSplitTypes.js'

import handlePageEnterAnimation from './animations/general/handlePageEnter.js'
import locomotiveScroll from './utilities/smoothScroll.js'

gsap.registerPlugin(ScrollTrigger)
menu.init()

const mm = gsap.matchMedia()

let currentAnimationModule = null

function resetWebflow(data) {
  let parser = new DOMParser()
  let dom = parser.parseFromString(data.next.html, 'text/html')
  let webflowPageId = $(dom).find('html').attr('data-wf-page')
  $('html').attr('data-wf-page', webflowPageId)
  window.Webflow && window.Webflow.destroy()
  window.Webflow && window.Webflow.ready()
  window.Webflow && window.Webflow.require('ix2').init()
}

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
preloader.init(initialPageName)
handleResponsiveElements()
disableAllFirstOptions()
initDropdownHoverBehavior()
document.addEventListener('onPageReady', (event) => {
  if (event.detail === true) {
    handlePageEnterAnimation(getCurrentPage()).play()
  }
})
window.onbeforeunload = function () {
  locomotiveScroll.start()
  locomotiveScroll.scrollTo(0, { immediate: true })
}

barba.hooks.enter(() => {
  window.scrollTo(0, 0)
})

barba.hooks.beforeEnter(() => {
  createSplitTypes.cleanup()
})

barba.hooks.afterEnter((data) => {
  resetWebflow(data)
  cleanupCurrentModule()
  disableAllFirstOptions()
})

barba.hooks.after((data) => {
  const pageName = data.next.namespace
  updateCurrentNavLink()
  loadPageModule(pageName)
  handleResponsiveElements()
  initDropdownHoverBehavior()
  createSmoothScroll()
})
