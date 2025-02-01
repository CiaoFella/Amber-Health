import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger.js'
import MotionPathPlugin from 'gsap/MotionPathPlugin.js'
import barba from '@barba/core'
import SplitType from 'split-type'
import LocomotiveScroll from 'locomotive-scroll'

gsap.defaults({
  ease: 'power2.inOut',
  duration: 1,
})

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin)

export { gsap, ScrollTrigger, MotionPathPlugin, barba, SplitType, LocomotiveScroll }
