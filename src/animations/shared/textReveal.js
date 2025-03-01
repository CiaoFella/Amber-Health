import { gsap, SplitType, ScrollTrigger } from '../../vendor.js'

let ctx

function init() {
  const sections = document.querySelectorAll('[anm-scroll-text=section]')
  const mm = gsap.matchMedia()

  const topClipPath = 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)'
  const fullClipPath = 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'

  if (sections && sections.length > 0) {
    sections.forEach((section) => {
      if (handleAnimationDisable(section)) {
        return
      }

      const scroller = section.closest('[anm-scroller=scroller]') || window
      const sectionStart = section.getAttribute('anm-start')
      const sectionReset = section.getAttribute('anm-reset')

      const headlines = section.querySelectorAll('[anm-scroll-text=headline]')
      const texts = Array.from(section.querySelectorAll('[anm-scroll-text=text], [anm-scroll-text=text] > p')).filter((el) => {
        return el.matches('[anm-scroll-text=text]') || (el.matches('p') && el.parentElement.matches('[anm-scroll-text=text]'))
      })

      mm.add(
        {
          desktop: '(min-width: 480px)',
          mobile: '(max-width: 479px)',
        },
        (context) => {
          ctx = gsap.context(() => {
            const tl = gsap.timeline({
              defaults: { duration: 1, ease: 'expo.out' },
            })

            ScrollTrigger.create({
              animation: tl,
              trigger: section,
              scroller: scroller,
              start: 'top bottom',
              end: sectionStart && sectionReset ? sectionStart : 'top 75%',
              toggleActions: sectionReset ? 'none play none reset' : 'none play none none',
            })

            if (headlines && headlines.length > 0) {
              headlines.forEach((headline) => {
                const distanceAttribute = headline.getAttribute('anm-distance') || '0%'
                const splitAttribute = context.conditions.mobile ? '' : headline.getAttribute('anm-split') || 'lines'
                const charsStaggerAttribute = headline.getAttribute('anm-chars-stagger') || 0.01
                const wordsStaggerAttribute = headline.getAttribute('anm-words-stagger') || 0.1
                const linesStaggerAttribute = headline.getAttribute('anm-lines-stagger') || 0.1
                const durationAttribute = headline.getAttribute('anm-duration') || 2
                const delayAttribute = headline.getAttribute('anm-delay') || 0
                const easeAttribute = headline.getAttribute('anm-ease') || 'expo.out'
                const customAttribute = context.conditions.mobile ? 'opacity: 0' : headline.getAttribute('anm-custom') || 'filter: blur(5px), opacity: 0'

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

                const animationProps = parseCustomAttribute(customAttribute)

                if (splitAttribute) {
                  const splitTypes = splitAttribute.split(',').map((type) => type.trim())
                  const splitHeadline = new SplitType(headline, {
                    types: splitTypes,
                  })
                  splitTypes.forEach((type) => {
                    const splitElements = splitHeadline[type] || []
                    let stagger = type === 'chars' ? 0.01 : 0.1
                    if (type === 'chars' && charsStaggerAttribute) {
                      stagger = parseFloat(charsStaggerAttribute)
                    } else if (type === 'words' && wordsStaggerAttribute) {
                      stagger = parseFloat(wordsStaggerAttribute)
                    } else if (type === 'lines' && linesStaggerAttribute) {
                      stagger = parseFloat(linesStaggerAttribute)
                    }
                    let yPosition
                    if (type === 'lines') {
                      yPosition = distanceAttribute.includes('%')
                        ? `${splitHeadline.lines.length * parseFloat(distanceAttribute)}%`
                        : splitHeadline.lines.length * parseFloat(distanceAttribute)
                    } else {
                      const hasUnit = /[a-z%]+$/i.test(distanceAttribute)
                      yPosition = hasUnit ? distanceAttribute : parseFloat(distanceAttribute)
                    }

                    tl.from(
                      splitElements.length ? splitElements : [headline],
                      {
                        y: yPosition,
                        stagger: splitElements.length ? stagger : 0,
                        delay: delayAttribute ? parseFloat(delayAttribute) : 0,
                        duration: durationAttribute ? parseFloat(durationAttribute) : 2,
                        ease: easeAttribute ? easeAttribute : 'expo.out',
                        ...animationProps,
                      },
                      0
                    )
                  })
                } else {
                  tl.from(
                    headline,
                    {
                      y: distanceAttribute,
                      delay: delayAttribute ? parseFloat(delayAttribute) : 0,
                      duration: durationAttribute ? parseFloat(durationAttribute) : 2,
                      ease: easeAttribute ? easeAttribute : 'expo.out',
                      ...animationProps,
                    },
                    0
                  )
                }
              })
            }

            if (texts && texts.length > 0) {
              const distanceAttribute = texts[0].getAttribute('anm-distance') || '0rem'
              const splitAttribute = context.conditions.mobile ? '' : texts[0].getAttribute('anm-split') || 'lines'
              const charsStaggerAttribute = texts[0].getAttribute('anm-chars-stagger') || 0.01
              const wordsStaggerAttribute = texts[0].getAttribute('anm-words-stagger') || 0.1
              const linesStaggerAttribute = texts[0].getAttribute('anm-lines-stagger') || 0.1
              const durationAttribute = texts[0].getAttribute('anm-duration') || 2
              const delayAttribute = texts[0].getAttribute('anm-delay') || 0.25
              const easeAttribute = texts[0].getAttribute('anm-ease') || 'expo.out'
              const customAttribute = context.conditions.mobile ? 'opacity: 0' : texts[0].getAttribute('anm-custom') || 'filter: blur(5px), opacity: 0'

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

              const animationProps = parseCustomAttribute(customAttribute)
              const toStateProps = transformValuesForToState(texts[0], animationProps)

              const hasUnit = /[a-z%]+$/i.test(distanceAttribute)
              const yPosition = hasUnit ? distanceAttribute : parseFloat(distanceAttribute)

              if (splitAttribute) {
                const splitTypes = splitAttribute.split(',').map((type) => type.trim())

                const splitTexts = texts.map(
                  (text) =>
                    new SplitType(text, {
                      types: splitTypes,
                      tagName: 'div',
                      lineClass: 'split-line',
                      wordClass: 'split-word',
                      charClass: 'split-char',
                      splitClass: false,
                      absolute: false,
                    })
                )

                splitTypes.forEach((type) => {
                  let allSplitElements = []
                  splitTexts.forEach((splitText) => {
                    if (type === 'lines') {
                      allSplitElements = [...allSplitElements, ...(splitText.lines || [])]
                    } else if (type === 'words') {
                      allSplitElements = [...allSplitElements, ...(splitText.words || [])]
                    } else if (type === 'chars') {
                      allSplitElements = [...allSplitElements, ...(splitText.chars || [])]
                    }
                  })

                  let stagger = type === 'chars' ? 0.01 : 0.1
                  if (type === 'chars' && charsStaggerAttribute) {
                    stagger = parseFloat(charsStaggerAttribute)
                  } else if (type === 'words' && wordsStaggerAttribute) {
                    stagger = parseFloat(wordsStaggerAttribute)
                  } else if (type === 'lines' && linesStaggerAttribute) {
                    stagger = parseFloat(linesStaggerAttribute)
                  }

                  tl.fromTo(
                    allSplitElements,
                    {
                      // clipPath: topClipPath,
                      y: yPosition,
                      ...animationProps,
                    },
                    {
                      // clipPath: fullClipPath,
                      y: 0,
                      stagger: stagger,
                      duration: durationAttribute ? parseFloat(durationAttribute) : 2,
                      delay: delayAttribute ? parseFloat(delayAttribute) : 0,
                      ease: easeAttribute ? easeAttribute : 'expo.out',
                      ...toStateProps,
                    },
                    0
                  )
                })
              } else {
                tl.fromTo(
                  texts,
                  {
                    y: yPosition,
                    ...animationProps,
                  },
                  {
                    yPercent: 0,
                    duration: parseFloat(durationAttribute),
                    delay: delayAttribute ? parseFloat(delayAttribute) : 2,
                    ease: easeAttribute ? easeAttribute : 'expo.out',
                    ...toStateProps,
                  },
                  0
                )
              }
            }
          })
        }
      )
    })
  }

  function handleAnimationDisable(element) {
    const disableAttribute = element.getAttribute('anm-disable')
    if (!disableAttribute) return false

    const viewports = disableAttribute.split(',').map((v) => v.trim())
    const mm = gsap.matchMedia()

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
