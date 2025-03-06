import { gsap } from '../../vendor.js'

let ctx

function init() {
  const buttons = document.querySelectorAll('[anm-btn=btn]')

  buttons.forEach((button) => {
    if (button.getAttribute('data-wf--btn-main--variant') === 'no-icons') {
      return
    }

    const buttonInner = button.querySelector('[anm-btn=inner]')
    const iconInner = button.querySelectorAll('[anm-btn=icon-inner]')

    const firstIconWrap = button.querySelector('[anm-btn=icon-wrap-1]')
    const secondIconWrap = button.querySelector('[anm-btn=icon-wrap-2]')

    const firstIcon = firstIconWrap.querySelector('[anm-btn=icon]')
    const secondIcon = secondIconWrap.querySelector('[anm-btn=icon]')

    const computedStyle = window.getComputedStyle(button)
    const gap = parseFloat(computedStyle.columnGap)
    const iconWidth = firstIconWrap.offsetWidth

    const distance = gap + iconWidth

    const tl = gsap.timeline({ defaults: { duration: 0.5, ease: 'power3.inOut' }, paused: true })

    gsap.set(buttonInner, { marginLeft: -distance })
    gsap.set(iconInner, { rotate: 45, transformOrigin: 'center center' })

    tl.fromTo(firstIconWrap, { scale: 0 }, { scale: 1, transformOrigin: 'left center' }, '<')
    tl.fromTo(secondIconWrap, { scale: 1 }, { scale: 0, transformOrigin: 'left center' }, '<')
    tl.to(buttonInner, { marginLeft: 0, marginRight: -distance }, '<')
    tl.to(button, { paddingLeft: '0.75rem', paddingRight: '1.5rem' }, '<')
    tl.to(iconInner, { rotate: 0, transformOrigin: 'center center' }, '<')
    tl.from(firstIcon, { xPercent: -100, yPercent: 100, duration: 0.25 }, '<+0.25')

    button.addEventListener('mouseenter', () => {
      tl.play()
    })

    button.addEventListener('mouseleave', () => {
      tl.reverse()
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
