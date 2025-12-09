/* 인트로용  */
document.addEventListener('DOMContentLoaded', () => {
  const intro_screen = document.querySelector('.intro_screen');
  const flash_layer = document.querySelector('.flash_layer');
  const intro_title = document.querySelector('.intro_title');
  const intro_sub = document.querySelector('.intro_subtitle');
  const glasses_img = document.querySelector('.glasses_img');
  const scroll_hint = document.querySelector('.scroll_hint');

  let is_activated = false;
  const trigger_distance = 400;

  function handle_scroll() {
    if (is_activated) return;

    const y = window.scrollY || window.pageYOffset;
    const progress = Math.min(1, y / trigger_distance);

    const scale = 1 + 13 * progress;
    glasses_img.style.transform =
      `translate(-50%, -50%) scale(${scale})`;
    glasses_img.style.opacity = String(1 - progress);

    const blur_val = 4 * (1 - progress);
    intro_title.style.filter = `blur(${blur_val}px)`;
    intro_title.style.opacity = String(0.6 + 0.4 * progress);
    intro_sub.style.filter = `blur(${blur_val}px)`;
    intro_sub.style.opacity = String(0.4 + 0.6 * progress);

    scroll_hint.style.opacity = String(1 - progress);

    if (progress >= 1) {
      activate_intro();
    }
  }

  function activate_intro() {
    if (is_activated) return;
    is_activated = true;

    window.removeEventListener('scroll', handle_scroll);

    glasses_img.style.transform =
      'translate(-50%, -50%) scale(14)';
    glasses_img.style.opacity = '0';

    intro_title.style.filter = 'blur(0)';
    intro_title.style.opacity = '1';
    intro_sub.style.filter = 'blur(0)';
    intro_sub.style.opacity = '1';
    scroll_hint.style.opacity = '0';

    flash_layer.classList.add('active');

    setTimeout(() => {
      intro_screen.classList.add('hidden');
    }, 600);
    window.scrollTo({ top: 0, behavior: 'auto' });
    setTimeout(() => {
      flash_layer.classList.remove('active');
    }, 900);
  }

  if (document.body.scrollHeight < trigger_distance + window.innerHeight) {
    const filler = document.createElement('div');
    filler.style.height = `${trigger_distance + 200}px`;
    document.body.appendChild(filler);
  }

  window.addEventListener('scroll', handle_scroll, { passive: true });
});


const cursor = document.querySelector(".cursor");
// 마우스 위치 커서 이동
document.addEventListener("mousemove", (e) => {
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";
});




// li, img 영역에 마우스가 들어가면 'grow' 클래스 추가, 나가면 제거
const hoverTargets = [...document.querySelectorAll("nav ul li"), ...document.querySelectorAll("img")];

hoverTargets.forEach(el => {
  el.addEventListener("mouseenter", () => {
    cursor.classList.add("grow");
  });
  el.addEventListener("mouseleave", () => {
    cursor.classList.remove("grow");
  });
});

// 01 visual 
gsap.timeline({
  scrollTrigger: {
    trigger: '.visual',
    start: '100% 100%',
    end: "100% 0%",
    scrub: 1,
  }
})
  .to('.logoWrap #a', { x: -150, y: 250, rotate: 20, ease: 'none', duration: 5 }, 0)
  .to('.logoWrap #b', { x: -30, y: 150, rotate: -10, ease: 'none', duration: 5 }, 0)
  .to('.logoWrap #c', { x: 0, y: 400, rotate: -10, ease: 'none', duration: 5 }, 0)
  .to('.logoWrap #d', { x: 50, y: 300, rotate: 10, ease: 'none', duration: 5 }, 0)
  .to('.logoWrap #e', { x: 100, y: 100, rotate: -10, yease: 'none', duration: 5 }, 0)
  .to('.logoWrap #f', { x: 50, y: 400, rotate: 20, yease: 'none', duration: 5 }, 0)



/* section2 */

const gallery = document.getElementById("gallery");

window.onmousemove = e => {
  const mouseX = e.clientX,
    mouseY = e.clientY;

  const xDecimal = mouseX / window.innerWidth,
    yDecimal = mouseY / window.innerHeight;

  const maxX = gallery.offsetWidth - window.innerWidth,
    maxY = gallery.offsetHeight - window.innerHeight;

  const panX = maxX * xDecimal * -1,
    panY = maxY * yDecimal * -1;

  gallery.animate({
    transform: `translate(${panX}px, ${panY}px)`
  }, {
    duration: 4000,
    fill: "forwards",
    easing: "ease"
  })
}


/*section5 mouse */
const hoverBg = document.querySelector('.hover_bg');
document.querySelectorAll('.project_row').forEach(item => {
  item.addEventListener('mouseenter', function () {
    const bgImg = item.getAttribute('data-bg');
    hoverBg.style.backgroundImage = `url('${bgImg}')`;
    hoverBg.classList.add('active');
  });
  item.addEventListener('mouseleave', function () {
    hoverBg.classList.remove('active');
    hoverBg.style.backgroundImage = '';
  });
});


// 05 .con4 .listBox .box ScrollTrigger Animation
gsap.utils.toArray('.con4 .listBox .box').forEach((selector) => {
  gsap.timeline({
    scrollTrigger: {
      trigger: selector,
      start: '0% 20%',
      end: '0% 0%',
      scrub: 1,
      // markers: true,
    }
  })
    .to(selector, { transform: 'rotateX(-10deg) scale(0.9)', transformOrigin: 'top', filter: 'brightness(0.3)' }, 0)
});

AOS.init({
  duration: 700,
  easing: 'ease-out',
  once: false,
  mirror: true,
  offset: 120
});