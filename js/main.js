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

/* section2  */
const cardStack = document.getElementById('cardStack');
const cards = document.querySelectorAll('.project_card');

// 호버 시 주변 카드 어둡게
cards.forEach(card => {
  card.addEventListener('mouseenter', function () {
    if (!this.classList.contains('dragging')) {
      cardStack.classList.add('hovering');
    }
  });

  card.addEventListener('mouseleave', function () {
    if (!this.classList.contains('dragging')) {
      cardStack.classList.remove('hovering');
    }
  });
});

// 드래그 변수 (컨테이너 기준 좌표 사용)
let activeCard = null;
let startX = 0;
let startY = 0;
let pointerOffsetX = 0;
let pointerOffsetY = 0;
let currentRotation = 0;

// 마우스/터치 다운
cards.forEach(card => {
  card.addEventListener('mousedown', startDrag);
  card.addEventListener('touchstart', startDrag, { passive: false });
});

function startDrag(e) {
  if (e.target.closest('.card_overlay')) return;

  e.preventDefault();

  activeCard = this;
  activeCard.classList.add('dragging');
  cardStack.classList.remove('hovering');

  const touch = e.type === 'touchstart' ? e.touches[0] : e;
  startX = touch.clientX;
  startY = touch.clientY;

  const rect = activeCard.getBoundingClientRect();
  const containerRect = cardStack.getBoundingClientRect();

  // pointer offset inside the card (viewport coords)
  pointerOffsetX = startX - rect.left;
  pointerOffsetY = startY - rect.top;

  // compute left/top relative to container
  const relLeft = rect.left - containerRect.left;
  const relTop = rect.top - containerRect.top;

  // set pixel left/top relative to container so movement is simple
  activeCard.style.left = `${relLeft}px`;
  activeCard.style.top = `${relTop}px`;

  // extract rotation and apply as inline transform around top-left
  const computedStyle = window.getComputedStyle(activeCard);
  const matrix = new DOMMatrix(computedStyle.transform);
  currentRotation = Math.atan2(matrix.b, matrix.a) * (180 / Math.PI);
  activeCard.style.transform = `rotate(${currentRotation}deg)`;
  activeCard.style.transformOrigin = '0 0';
  activeCard.style.transition = 'none';

  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', stopDrag);
  document.addEventListener('touchmove', drag, { passive: false });
  document.addEventListener('touchend', stopDrag);
}

function drag(e) {
  if (!activeCard) return;
  e.preventDefault();

  const touch = e.type === 'touchmove' ? e.touches[0] : e;
  const containerRect = cardStack.getBoundingClientRect();

  // new position in container coordinates
  const newLeft = touch.clientX - pointerOffsetX - containerRect.left;
  const newTop = touch.clientY - pointerOffsetY - containerRect.top;

  activeCard.style.left = `${newLeft}px`;
  activeCard.style.top = `${newTop}px`;
}

function stopDrag(e) {
  if (!activeCard) return;

  activeCard.classList.remove('dragging');
  // restore transform origin for hover/stack behavior
  activeCard.style.transformOrigin = '';
  activeCard.style.transition = '';
  activeCard = null;

  document.removeEventListener('mousemove', drag);
  document.removeEventListener('mouseup', stopDrag);
  document.removeEventListener('touchmove', drag);
  document.removeEventListener('touchend', stopDrag);
}
// R 키로 모든 카드 리셋
document.addEventListener('keydown', (e) => {
  if (e.key === 'r' || e.key === 'R') {
    cards.forEach(card => {
      card.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
      card.style.transform = '';
      card.style.left = '';
      card.style.top = '';

      setTimeout(() => {
        card.style.transition = '';
      }, 500);
    });
  }
});

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

// macOS Dock 애니메이션 (profile_content 내에서 완벽 동작)
document.addEventListener('DOMContentLoaded', function () {
  const icons = document.querySelectorAll(".dock-container .ico");

  const resetIcons = () => {
    icons.forEach((item) => {
      item.style.transform = "scale(1) translateY(0px)";
    });
  };

  icons.forEach((item, index) => {
    item.addEventListener("mouseenter", () => focus(index));
    item.addEventListener("mouseleave", resetIcons);
  });

  const focus = (index) => {
    resetIcons();

    const transformations = [
      { idx: index - 2, scale: 1.1, translateY: 0 },
      { idx: index - 1, scale: 1.2, translateY: -6 },
      { idx: index, scale: 1.5, translateY: -15 },
      { idx: index + 1, scale: 1.2, translateY: -6 },
      { idx: index + 2, scale: 1.1, translateY: 0 }
    ];

    transformations.forEach(({ idx, scale, translateY }) => {
      if (icons[idx]) {
        icons[idx].style.transform = `scale(${scale}) translateY(${translateY}px)`;
      }
    });
  };
});



AOS.init({
  duration: 700,
  easing: 'ease-out',
  once: false,
  mirror: true,
  offset: 120
});

/* top */
// TOP 버튼
const btnTop = document.querySelector('.btn_top');

window.addEventListener('scroll', () => {
  // 300px 이상 스크롤되면 노출
  if (window.scrollY > 300) {
    btnTop.classList.add('show');
  } else {
    btnTop.classList.remove('show');
  }
});

btnTop.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});
