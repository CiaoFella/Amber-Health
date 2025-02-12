import { gsap, ScrollTrigger, SplitType } from '../../vendor.js'
import locomotiveScroll from '../../utilities/smoothScroll.js'

let ctx

function init() {
  const sections = document.querySelectorAll('[anm-approach=section]')

  if (sections.length > 0) {
    ctx = gsap.context(() => {
      sections.forEach((section) => {
        const scrollWrap = section.querySelector('[anm-approach=scroll-wrap]')
        const indicator = section.querySelector('[anm-approach=indicator]')
        const indicatorLine = section.querySelector('[anm-approach=indicator-line]')
        const indicatorParent = indicator.parentElement
        const roller = section.querySelector('[anm-approach=roller]')
        const items = section.querySelectorAll('[anm-approach=item]')
        const visuals = section.querySelector('[anm-approach=visuals]').children

        let indicatorParentHeight = indicatorParent.offsetHeight

        setInterval(() => {
          indicatorParentHeight = indicatorParent.offsetHeight
        }, 500)

        const scrubTl = gsap.timeline({ defaults: { duration: 1, ease: 'linear' } })

        ScrollTrigger.create({
          trigger: scrollWrap,
          animation: scrubTl,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
        })

        scrubTl.to(indicator, {
          motionPath: {
            path: indicatorLine,
            align: indicatorLine,
            autoRotate: false,
            alignOrigin: [0.5, 0.5],
            start: 0,
            end: 1,
          },
        })

        items.forEach((item, index) => {
          const visual = visuals[index]
          const text = item.querySelector('[anm-approach=text]')
          const headline = item.querySelector('[anm-approach=headline]')
          const sectionHeight = scrollWrap.offsetHeight
          const itemCount = items.length
          const segmentHeight = sectionHeight / itemCount

          if (headline) {
            headline.parentElement.addEventListener('click', () => {
              const scrollPosition = segmentHeight * (index + 1)

              locomotiveScroll.scrollTo(scrollWrap, {
                offset: index === 0 ? -segmentHeight + 0.9999999 * segmentHeight : -segmentHeight + scrollPosition - segmentHeight / 2 + 100,
                duration: 0.75,
              })
            })
          }

          if (index === 0) {
            item.classList.add('is-active')
            visual.classList.add('is-active')
            gsap.set(roller, { yPercent: 0 })
          }

          new SplitType(text, { types: 'lines' })

          const contentHeight = text.scrollHeight
          text.style.setProperty('--content-height', `${contentHeight}px`)

          ScrollTrigger.create({
            trigger: scrollWrap,
            start: `top-=${segmentHeight - segmentHeight * (index + 1)} center`,
            end: `top-=${segmentHeight - segmentHeight * (index + 1)} center`,
            onEnter: () => {
              item.classList.add('is-active')
              visual.classList.add('is-active')
              gsap.to(roller, {
                yPercent: -(index * 20),
                duration: 1,
                ease: 'expo.out',
              })
              if (items[index - 1] && index !== 0) {
                items[index - 1].classList.remove('is-active')
                visuals[index - 1].classList.remove('is-active')
              }
            },
            onLeaveBack: () => {
              if (index !== 0) {
                item.classList.remove('is-active')
                visual.classList.remove('is-active')
                gsap.to(roller, {
                  yPercent: -((index - 1) * 20),
                  duration: 1,
                  ease: 'expo.out',
                })
              }
              if (items[index - 1]) {
                items[index - 1].classList.add('is-active')
                visuals[index - 1].classList.add('is-active')
              }
            },
          })
        })
      })
    })
  }
}

function cleanup() {
  ctx && ctx.revert()
}

export default {
  init,
  cleanup,
}
