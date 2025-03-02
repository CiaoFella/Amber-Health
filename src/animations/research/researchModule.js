import { isLandscape } from '../../utilities/variables.js'
import { gsap, ScrollTrigger } from '../../vendor.js'

let ctx
let mm = gsap.matchMedia()

function init() {
  const section = document.querySelector('[anm-research=section]')

  if (!section) return

  const scrollCircle = section.querySelector('[anm-research=scroll-circle]')
  const scrollRollerDecade = section.querySelector('[anm-research=decade-roller]')
  const scrollRollerYear = section.querySelector('[anm-research=year-roller]')
  const circles = section.querySelectorAll('[anm-research=circle]')
  const researchItems = section.querySelectorAll('[anm-research=item]')

  updateYear(9)
  updateDecade(1)

  ctx = gsap.context(() => {
    researchItems.forEach((researchItem) => {
      const content = researchItem.querySelector('[anm-research=content]')
      if (!content) return

      const tl = gsap.timeline({ defaults: { duration: 1.5, ease: 'expo.out' } })

      ScrollTrigger.create({
        trigger: researchItem,
        animation: tl,
        start: 'top bottom',
        end: 'top center',
        toggleActions: 'none play none none',
      })

      mm.add(`(not ${isLandscape})`, () => {
        tl.from(content.children, { opacity: 0, filter: 'blur(10px)', stagger: 0.1, delay: 0.25 })
      }).add(`${isLandscape}`, () => {
        tl.from(content.children, { opacity: 0, stagger: 0.1, delay: 0.25 })
      })
    })

    circles.forEach((circle) => {
      const year = circle.getAttribute('anm-year')
      if (!year || !scrollRollerDecade || !scrollRollerYear) return

      const researchItem = circle.closest('[anm-research=item]')
      if (!researchItem) return

      const lastDigit = parseInt(year.slice(-1))
      const tensDigit = parseInt(year.slice(-2, -1))

      gsap.to(scrollRollerDecade, {
        scrollTrigger: {
          trigger: researchItem,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => {
            updateYear(lastDigit)
            updateDecade(tensDigit)
          },
          onEnterBack: () => {
            updateYear(lastDigit)
            updateDecade(tensDigit)
          },
        },
      })
    })
  }, section)

  function updateYear(digit) {
    const digitWidth = getDigitWidth(digit)
    gsap.to(scrollRollerYear, {
      y: `${-digit * 100}%`,
      width: digitWidth,
      duration: 1,
      ease: 'expo.out',
    })
  }

  function updateDecade(digit) {
    const digitWidth = getDigitWidth(digit)
    gsap.to(scrollRollerDecade, {
      y: `${-digit * 100}%`,
      width: digitWidth,
      duration: 1,
      ease: 'expo.out',
    })
  }

  function getDigitWidth(digit) {
    const temp = document.createElement('span')
    temp.style.visibility = 'hidden'
    temp.style.position = 'absolute'
    temp.style.fontSize = getComputedStyle(scrollRollerYear).fontSize
    temp.style.fontFamily = getComputedStyle(scrollRollerYear).fontFamily
    temp.textContent = digit
    document.body.appendChild(temp)

    const width = `${temp.offsetWidth}px`
    document.body.removeChild(temp)

    return width
  }
}

function cleanup() {
  ctx && ctx.revert()
}

export default {
  init,
  cleanup,
}
