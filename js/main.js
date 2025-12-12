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
/* 

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
}); */

const cursor = document.querySelector(".cursor");
const cursorLabel = document.querySelector(".cursor-label");

// 마우스 위치 커서 이동
document.addEventListener("mousemove", (e) => {
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";
});

// 1) 기본 grow 대상: nav li + 모든 img
const hoverTargets = [
  ...document.querySelectorAll("nav ul li"),
  ...document.querySelectorAll("img")
];

hoverTargets.forEach(el => {
  el.addEventListener("mouseenter", () => {
    cursor.classList.add("grow");
  });
  el.addEventListener("mouseleave", () => {
    cursor.classList.remove("grow");
  });
});

// 2) 섹션2(.graphic) 안의 카드 이미지에만 Drag me! 표시
const section2Images = document.querySelectorAll(
  /*   ".graphic .project_card", */
  ".graphic .project_card"
);

section2Images.forEach(img => {
  img.addEventListener("mouseenter", () => {
    cursor.classList.add("show-drag");
  });
  img.addEventListener("mouseleave", () => {
    cursor.classList.remove("show-drag");
  });
});


/* 아이콘 드래그 */
const dockIcons = document.querySelectorAll('.dock_container .ico');
const emojiDropTarget = document.getElementById('emoji-profile');

let draggingIcon = null;
let eatenCount = 0;                 // 몇 개 먹었는지
const TOTAL_ICONS = 8;              // ✅ 먹어야 하는 아이콘 개수(휴지통 제외)
const allClearImage = "url('img/선글라스.png')";   // 전부 먹었을 때 이미지

dockIcons.forEach(icon => {
  icon.addEventListener('dragstart', e => {
    draggingIcon = icon;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', 'dock-icon');
    icon.classList.add('dragging');

    icon.style.opacity = '0.6';
    icon.style.transform = 'scale(1.2) translateY(-8px)';
    icon.style.boxShadow = '0 8px 16px rgba(0,0,0,0.35)';
  });

  icon.addEventListener('dragend', () => {
    icon.classList.remove('dragging');
    icon.style.opacity = '1';
    icon.style.transform = 'scale(1) translateY(0)';
    icon.style.boxShadow = 'none';
  });
});

if (emojiDropTarget) {
  emojiDropTarget.addEventListener('dragover', e => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    emojiDropTarget.classList.add('drop-active');
  });

  emojiDropTarget.addEventListener('dragleave', () => {
    emojiDropTarget.classList.remove('drop-active');
  });

  emojiDropTarget.addEventListener('drop', e => {
    e.preventDefault();
    emojiDropTarget.classList.remove('drop-active');

    if (!draggingIcon) return;

    // 휴지통은 먹지 않음 (ico_bin 클래스 기준)
    if (draggingIcon.classList.contains('ico_bin')) {
      draggingIcon = null;
      return;
    }

    const previousBg = emojiDropTarget.style.backgroundImage;

    // '냠' 이미지로 변경
    emojiDropTarget.style.backgroundImage = "url('img/냠.png')";

    setTimeout(() => {
      eatenCount += 1; // 하나 먹음

      const li = draggingIcon.closest('li');
      if (li) li.remove();

      if (eatenCount < TOTAL_ICONS) {
        // 아직 8개 다 안 먹었으면 원래 얼굴
        emojiDropTarget.style.backgroundImage = previousBg;
      } else {
        // 8개 다 먹었을 때 스페셜 이미지
        emojiDropTarget.style.backgroundImage = allClearImage;
      }

      draggingIcon = null;
    }, 600);
  });
}






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

/* section5: publishing 3D slider */
document.addEventListener('DOMContentLoaded', () => {
  const publishingProjects = [
    {
      title: '01 WEB Team Projects',
      image: 'img/web.png',
      video: 'img/boj.mp4',
      link: 'https://hamsunghee.github.io/Beauty-of-Joseon/'
    },
    {
      title: '02 APP Team Projects',
      image: 'img/appmockup.png',
      video: 'video/app-team.mp4',
      link: '#'
    },
    {
      title: '03 WEB Projects',
      image: 'img/bud.png',
      video: 'video/web-single.mp4',
      link: '#'
    },
    {
      title: '04 APP Projects',
      image: 'img/appmockup2.png',
      video: 'img/p_app.mp4',
      link: '#'
    }
  ];

  let publishingIndex = 0;
  const container = document.getElementById('publishingSwiper');
  if (!container) return;

  const titlesList = document.getElementById('publishingTitles');
  const videoEl = document.getElementById('publishingVideo');
  const linkEl = document.getElementById('publishingLink');
  const bannerTitle = document.getElementById('publishingBannerTitle');
  const currentEl = document.getElementById('publishingCurrent');
  const totalEl = document.getElementById('publishingTotal');

  totalEl.textContent = publishingProjects.length;

  publishingProjects.forEach((project, index) => {
    const slide = document.createElement('div');
    slide.className = 'swiper_slide';
    slide.innerHTML = `
      <a href="#" class="project_visual_wrapper">
        <div class="project_visual_image_move">
          <div class="project_visual_image" style="background-image: url('${project.image}')"></div>
        </div>
        <div class="project_highlight"></div>
      </a>
    `;
    container.appendChild(slide);

    const titleItem = document.createElement('button');
    titleItem.type = 'button';
    titleItem.className = 'project_title_link';
    titleItem.innerHTML = `
      <div>${project.title}</div>
      <div class="titles_dot"></div>
    `;
    titleItem.addEventListener('click', (e) => {
      e.preventDefault();
      goToPublishingSlide(index);
    });
    titlesList.appendChild(titleItem);
  });

  const slides = container.querySelectorAll('.swiper_slide');
  const titles = titlesList.querySelectorAll('.project_title_link');
  const videoComponent = document.querySelector('.video_component');

  function updatePublishingSlides() {
    videoComponent.style.opacity = '0.5';

    slides.forEach((slide, index) => {
      slide.classList.remove('is_active');
      titles[index].classList.remove('is_active');

      const offset = index - publishingIndex;
      const absOffset = Math.abs(offset);

      const z = -absOffset * 150;
      const x = offset * 200;
      const opacity = 1 - (absOffset * 0.3);
      const scale = 1 - (absOffset * 0.2);

      gsap.to(slide, {
        x,
        z,
        opacity,
        scale,
        duration: 0.6,
        ease: 'power2.out'
      });
    });

    slides[publishingIndex].classList.add('is_active');
    titles[publishingIndex].classList.add('is_active');

    setTimeout(() => {
      videoEl.src = publishingProjects[publishingIndex].video;
      linkEl.href = publishingProjects[publishingIndex].link;
      bannerTitle.textContent = publishingProjects[publishingIndex].title;
      currentEl.textContent = publishingIndex + 1;
      videoComponent.style.opacity = '1';
    }, 300);
  }

  function goToPublishingSlide(index) {
    publishingIndex = index;
    updatePublishingSlides();
  }

  function nextPublishingSlide() {
    publishingIndex = (publishingIndex + 1) % publishingProjects.length;
    updatePublishingSlides();
  }

  function prevPublishingSlide() {
    publishingIndex = (publishingIndex - 1 + publishingProjects.length) % publishingProjects.length;
    updatePublishingSlides();
  }

  document.getElementById('publishingNext').addEventListener('click', (e) => {
    e.preventDefault();
    nextPublishingSlide();
  });
  document.getElementById('publishingPrev').addEventListener('click', (e) => {
    e.preventDefault();
    prevPublishingSlide();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextPublishingSlide();
    if (e.key === 'ArrowLeft') prevPublishingSlide();
  });

  updatePublishingSlides();
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

// macOS Dock 애니메이션 

const faceImages = [
  'url(/img/정상.png)',
  'url(/img/수염.png)',
  'url(/img/브이.png)',
  'url(/img/헉.png)',
  'url(/img/쉿.png)',
  'url(/img/굿.png)'
];
let currentIndex = 0;

const btn = document.getElementById('emoji-profile');
btn.style.backgroundImage = faceImages[0];  // 초기 설정

btn.addEventListener('click', function () {
  currentIndex = (currentIndex + 1) % faceImages.length;
  const nextImage = faceImages[currentIndex];
  console.log('변경:', currentIndex, nextImage);  // 디버깅용
  this.style.backgroundImage = nextImage;
});

/*  */

const icons = document.querySelectorAll(".dock_container .ico");

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
