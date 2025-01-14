import gsap from 'gsap';

let ctx;

function init() {}

function cleanup() {
  ctx && ctx.revert();
}

export default {
  init,
  cleanup,
};
