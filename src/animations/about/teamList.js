import { gsap, SplitType } from '../../vendor.js'

let ctx

function init() {
  const modalWrap = document.querySelector('[anm-team-modal=wrap]')
  const modalBg = document.querySelector('[anm-team-modal=bg]')
  const modalOuter = document.querySelector('[anm-team-modal=outer]')
  const modalList = document.querySelector('[anm-team-modal=list]')
  const modalItems = document.querySelectorAll('[anm-team-modal=item]')
  const triggers = document.querySelectorAll('[anm-team-modal=trigger]')

  ctx = gsap.context(() => {
    gsap.set(modalWrap, { display: 'none' })

    triggers.forEach((trigger, index) => {
      trigger.addEventListener('click', () => {
        modalItems.forEach((item) => item.classList.remove('is-active'))
        modalItems[index].classList.add('is-active')

        const activeText = modalItems[index].querySelector('[anm-team-modal=text]')
        const paragraphs = activeText.querySelectorAll('p')

        paragraphs.forEach((p) => {
          new SplitType(p, {
            types: 'lines',
            lineClass: 'split-line',
          })
        })

        gsap.set(modalWrap, { display: 'flex' })

        const tl = gsap.timeline()
        tl.fromTo(modalBg, { opacity: 0 }, { opacity: 1, duration: 0.3 }).fromTo(modalOuter, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.3 }, '-=0.2')

        gsap.set(modalList, {
          x: `${index * -100}%`,
        })
      })
    })

    modalBg.addEventListener('click', () => {
      const tl = gsap.timeline()
      tl.to(modalOuter, { opacity: 0, y: 20, duration: 0.3 }).to(
        modalBg,
        {
          opacity: 0,
          duration: 0.3,
          onComplete: () => {
            gsap.set(modalWrap, { display: 'none' })
            modalItems.forEach((item) => {
              item.classList.remove('is-active')
              const text = item.querySelector('[anm-team-modal=text]')
              if (text) {
                const paragraphs = text.querySelectorAll('p')
                paragraphs.forEach((p) => {
                  SplitType.revert(p)
                })
              }
            })
          },
        },
        '-=0.2'
      )
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
