import { gsap, ScrollTrigger } from '../../vendor.js'

let ctx

function init() {
  const sections = document.querySelectorAll('[anm-scroll-element=section]')

  if (sections && sections.length > 0) {
    sections.forEach((section) => {
      if (handleAnimationDisable(section)) {
        return
      }

      const scroller = section.closest('[anm-scroller=scroller]') || window
      const sectionStart = section.getAttribute('anm-start') || 'top bottom'
      const sectionEnd = section.getAttribute('anm-end') || 'bottom top'
      const sectionScrub = section.getAttribute('anm-scrub') || false
      const sectionReset = section.getAttribute('anm-reset') || false

      const elements = section.querySelectorAll('[anm-scroll-element=element]')

      ctx = gsap.context(() => {
        const tl = gsap.timeline({
          defaults: { duration: 1, ease: 'power2.inOut' },
        })

        ScrollTrigger.create({
          animation: tl,
          trigger: section,
          scroller: scroller,
          start: sectionReset === 'true' ? 'top bottom' : sectionStart,
          end: sectionReset === 'true' ? sectionStart : sectionEnd,
          scrub: sectionScrub === 'true' ? true : false,
          toggleActions: sectionReset === 'true' ? 'none play none reset' : sectionScrub === 'true' ? null : 'play none none none',
        })

        elements.forEach((element) => {
          const duration = element.getAttribute('anm-duration') || 1
          const custom = element.getAttribute('anm-custom')
          const ease = element.getAttribute('anm-ease') || 'expo.out'
          const delay = element.getAttribute('anm-delay') || 0
          const type = element.getAttribute('anm-type') || 'slide'
          const direction = element.getAttribute('anm-direction') || 'bottom'

          const parseCustomAttribute = (attr) => {
            const props = {}
            if (attr) {
              attr.split(',').forEach((pair) => {
                const [key, value] = pair.split(':').map((item) => item.trim())
                if (key && value) {
                  props[key] = value
                }
              })
            }
            return props
          }

          const transformValuesForToState = (element, props) => {
            const transformedValues = {}
            const computedStyles = window.getComputedStyle(element)
            for (const key in props) {
              let value = props[key]
              if (key === 'opacity') {
                transformedValues[key] = '1'
              } else if (key === 'scale') {
                transformedValues[key] = 1
              } else {
                transformedValues[key] = value.replace(/(\d+(\.\d+)?)/g, (match) => {
                  const unitMatch = match.match(/(\d+(\.\d+)?)(px|rem|em|%|vh|vw|dvh|dvw|deg|rad|grad|turn|cvw|cvh)?/)
                  return unitMatch ? `0${unitMatch[3] || ''}` : '0'
                })

                if (!/\d/.test(value)) {
                  transformedValues[key] = computedStyles[key] || value
                }
              }
            }
            return transformedValues
          }

          const animationProps = parseCustomAttribute(custom)
          const toStateProps = transformValuesForToState(element, animationProps)

          switch (type) {
            case 'clip':
              switch (direction) {
                case 'top':
                  tl.fromTo(
                    element,
                    { clipPath: bottomClipPath, ...animationProps },
                    { clipPath: fullClipPath, duration: duration, ease: ease, delay: delay, ...toStateProps },
                    0
                  )
                  break
                case 'bottom':
                  tl.fromTo(
                    element,
                    { clipPath: topClipPath, ...animationProps },
                    { clipPath: fullClipPath, duration: duration, ease: ease, delay: delay, ...toStateProps },
                    0
                  )
                  break
                case 'left':
                  tl.fromTo(
                    element,
                    { clipPath: rightClipPath, ...animationProps },
                    { clipPath: fullClipPath, duration: duration, ease: ease, delay: delay, ...toStateProps },
                    0
                  )
                  break
                case 'right':
                  tl.fromTo(
                    element,
                    { clipPath: leftClipPath, ...animationProps },
                    { clipPath: fullClipPath, duration: duration, ease: ease, delay: delay, ...toStateProps },
                    0
                  )
                  break
                case 'center':
                  tl.fromTo(
                    element,
                    { clipPath: centerClipPath, ...animationProps },
                    { clipPath: fullClipPath, duration: duration, ease: ease, delay: delay, ...toStateProps },
                    0
                  )
                  break
                case 'custom-clip':
                  {
                    const clipPathStart = element.getAttribute('anm-clip-path-start') || centerClipPath
                    const clipPathEnd = element.getAttribute('anm-clip-path-end') || fullClipPath

                    tl.fromTo(
                      element,
                      { clipPath: clipPathStart, ...animationProps },
                      { clipPath: clipPathEnd, duration: duration, ease: ease, delay: delay, ...toStateProps },
                      0
                    )
                  }
                  break
              }
              break
            case 'opacity':
              tl.fromTo(element, { opacity: 0, ...animationProps }, { opacity: 1, duration: duration, ease: ease, delay: delay, ...toStateProps }, 0)
              break
            case 'slide':
              const distance = element.getAttribute('anm-distance') || '200'
              switch (direction) {
                case 'top':
                  tl.fromTo(element, { y: -distance, ...animationProps }, { y: 0, duration: duration, ease: ease, delay: delay, ...toStateProps }, 0)
                  break
                case 'bottom':
                  tl.fromTo(element, { y: distance, ...animationProps }, { y: 0, duration: duration, ease: ease, delay: delay, ...toStateProps }, 0)
                  break
                case 'left':
                  tl.fromTo(element, { x: -distance, ...animationProps }, { x: 0, duration: duration, ease: ease, delay: delay, ...toStateProps }, 0)
                  break
                case 'right':
                  tl.fromTo(element, { x: distance, ...animationProps }, { x: 0, duration: duration, ease: ease, delay: delay, ...toStateProps }, 0)
                  break
                case 'top left':
                  tl.fromTo(
                    element,
                    { x: -distance, y: -distance, ...animationProps },
                    { x: 0, y: 0, duration: duration, ease: ease, delay: delay, ...toStateProps },
                    0
                  )
                  break
                case 'top right':
                  tl.fromTo(
                    element,
                    { x: distance, y: -distance, ...animationProps },
                    { x: 0, y: 0, duration: duration, ease: ease, delay: delay, ...toStateProps },
                    0
                  )
                  break
                case 'bottom right':
                  tl.fromTo(
                    element,
                    { x: distance, y: distance, ...animationProps },
                    { x: 0, y: 0, duration: duration, ease: ease, delay: delay, ...toStateProps },
                    0
                  )
                  break
                case 'bottom left':
                  tl.fromTo(
                    element,
                    { x: -distance, y: distance, ...animationProps },
                    { x: 0, y: 0, duration: duration, ease: ease, delay: delay, ...toStateProps },
                    0
                  )
                  break
              }
              break
            case 'scale':
              const scale = parseFloat(element.getAttribute('anm-scale')) || 0.8
              tl.fromTo(element, { scale: scale, ...animationProps }, { scale: 1, duration: duration, ease: ease, delay: delay, ...toStateProps }, 0)
              break
            case 'rotate':
              const rotate = parseFloat(element.getAttribute('anm-rotate')) || 15
              switch (direction) {
                case 'in':
                  tl.fromTo(
                    element,
                    { rotate: -rotate, ...animationProps },
                    { rotate: 0, duration: duration, ease: ease, delay: delay, ...toStateProps },
                    0
                  )
                  break
                case 'out':
                  tl.fromTo(
                    element,
                    { rotate: rotate, ...animationProps },
                    { rotate: 0, duration: duration, ease: ease, delay: delay, ...toStateProps },
                    0
                  )
                  break
              }
              break
          }
        })
      })
    })
  }

  const centerClipPath = 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)'
  const rightClipPath = 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)'
  const leftClipPath = 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)'
  const bottomClipPath = 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)'
  const topClipPath = 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)'
  const fullClipPath = 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'

  function handleAnimationDisable(element) {
    const disableAttribute = element.getAttribute('anm-disable')
    if (!disableAttribute) return false

    const viewports = disableAttribute.split(',').map((v) => v.trim())

    const mediaQueries = {
      desktop: '(min-width: 992px)',
      tablet: '(min-width: 768px) and (max-width: 991px)',
      landscape: '(orientation: landscape) and (max-width: 767px)',
      mobile: '(max-width: 479px)',
    }

    const disableQueries = viewports.map((viewport) => mediaQueries[viewport]).filter(Boolean)

    if (disableQueries.length === 0) return false

    let isDisabled = false
    isDisabled = disableQueries.some((query) => window.matchMedia(query).matches)

    return isDisabled
  }
}

function cleanup() {
  ctx && ctx.revert()
}

export default {
  init,
  cleanup,
}
