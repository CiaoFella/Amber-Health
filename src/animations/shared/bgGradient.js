import { gsap } from '../../vendor.js'

let ctx
let morphingTimeline
let positionAnimation

function init() {
  const sections = document.querySelectorAll('[anm-bg-gradient=section]')
  if (sections.length === 0) return

  sections.forEach((section) => {
    const gradient = section.querySelector('[anm-bg-gradient=gradient]')
    if (!gradient) return

    ctx = gsap.context(() => {
      const gradientWidth = gradient.clientWidth
      const gradientHeight = gradient.clientHeight

      gsap.set(gradient, { width: 0, height: 0 })

      gsap.to(gradient, {
        width: gradientWidth,
        height: gradientHeight,
        duration: 2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'top center',
          toggleActions: 'none play none reset',
        },
      })

      morphingTimeline = gsap.timeline({
        repeat: -1,
        yoyo: true,
        defaults: { duration: 4, ease: 'none' },
      })

      morphingTimeline
        .to(gradient, {
          backgroundImage: 'radial-gradient(circle, #fea83d, #ff6c4566)',
          scale: 1.2,
        })
        .to(gradient, {
          backgroundImage: 'radial-gradient(circle, #ff6c45, #fea83d66)',
          scale: 0.8,
        })
        .to(gradient, {
          backgroundImage: 'radial-gradient(circle, #ffae44, #ff454b66)',
          scale: 1.1,
        })

      positionAnimation = gsap.to(gradient, {
        motionPath: {
          path: [
            { x: 25, y: 0 },
            { x: -15, y: -25 },
            { x: -35, y: 15 },
            { x: 20, y: 40 },
            { x: 25, y: 0 },
          ],
          curviness: 2,
          autoRotate: false,
        },
        duration: 20,
        ease: 'none',
        repeat: -1,
        transformOrigin: 'center center',
      })

      gsap.to(gradient, {
        rotate: 360,
        duration: 20,
        repeat: -1,
        ease: 'none',
      })

      section.addEventListener('mousemove', (e) => {
        const rect = section.getBoundingClientRect()
        const xPercent = ((e.clientX - rect.left) / rect.width - 0.5) * 50
        const yPercent = ((e.clientY - rect.top) / rect.height - 0.5) * 50

        gsap.to(gradient, {
          translate: `${xPercent}% ${yPercent}%`,
          duration: 1,
          ease: 'power2.out',
          overwrite: 'auto',
        })
      })

      section.addEventListener('mouseleave', () => {
        gsap.to(gradient, {
          translate: '0% 0%',
          duration: 1.5,
          ease: 'power2.inOut',
        })
      })
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
