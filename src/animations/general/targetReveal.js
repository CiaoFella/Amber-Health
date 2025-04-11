import { gsap } from '../../vendor.js'

let ctx

function init() {
  ctx = gsap.context(() => {
    const triggers = document.querySelectorAll('[anm-target-reveal-trigger]')

    triggers.forEach((trigger) => {
      if (handleAnimationDisable(trigger)) {
        return
      }

      const name = trigger.getAttribute('anm-target-reveal-trigger')
      const closeElement = document.querySelector(`[anm-target-reveal-close="${name}"]`)
      const target = document.querySelector(`[anm-target-reveal-target="${name}"]`)

      if (target) {
        const triggerType = trigger.getAttribute('anm-trigger-type') || 'click'
        const animationType = target.getAttribute('anm-animation-type') || 'slide'
        const direction = target.getAttribute('anm-direction') || 'up'
        const animateChildren = target.getAttribute('anm-animate-children') || false
        const targetWrap = target.querySelector('[anm-target-reveal-target=wrap]') || target
        const duration = target.getAttribute('anm-duration') || 0.7
        const stagger = target.getAttribute('anm-stagger') || 0
        const delay = target.getAttribute('anm-delay') || 0
        const ease = target.getAttribute('anm-ease') || 'expo.inOut'
        const closeDelay = parseFloat(target.getAttribute('anm-close-delay')) * 1000 || 200
        const custom = target.getAttribute('anm-custom') || ''

        const targetElements = [targetWrap, animateChildren === 'true' ? targetWrap.children : undefined]

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
        const toStateProps = transformValuesForToState(targetWrap, animationProps)

        const tl = gsap.timeline({ defaults: { duration: duration, ease: ease, stagger: stagger }, delay: delay, paused: true })

        switch (animationType) {
          case 'slide':
            const distance = targetWrap.getAttribute('anm-distance') || '1rem'
            switch (direction) {
              case 'up':
                tl.fromTo(targetElements, { y: distance, opacity: 0, ...animationProps }, { y: 0, opacity: 1, ...toStateProps })
                break
              case 'down':
                tl.fromTo(targetElements, { y: distance, opacity: 0, ...animationProps }, { y: 0, opacity: 1, ...toStateProps })
                break
            }
            break
        }

        function close() {
          trigger.classList.remove('is-active')
          tl.reverse()
        }

        if (closeElement) {
          closeElement.addEventListener('click', () => {
            close()
          })
        }

        function open() {
          trigger.classList.add('is-active')
          tl.play()
        }

        let isHoveringTargetWrap = false
        let closeTimeout

        targetWrap.addEventListener('mouseenter', () => {
          isHoveringTargetWrap = true
          clearTimeout(closeTimeout)
        })

        if (triggerType === 'hover') {
          targetWrap.addEventListener('mouseleave', () => {
            isHoveringTargetWrap = false
            closeTimeout = setTimeout(() => {
              if (!isHoveringTargetWrap) {
                close()
              }
            }, closeDelay)
          })
        }

        switch (triggerType) {
          case 'click':
            trigger.addEventListener('click', () => {
              if (trigger.classList.contains('is-active')) {
                close()
              } else {
                open()
              }
            })
            break
          case 'hover':
            trigger.addEventListener('mouseenter', () => {
              clearTimeout(closeTimeout)
              open()
            })
            trigger.addEventListener('mouseleave', () => {
              closeTimeout = setTimeout(() => {
                if (!isHoveringTargetWrap) {
                  close()
                }
              }, closeDelay)
            })
            break
        }
      }
    })
  })

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
