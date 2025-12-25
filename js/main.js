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

const navLinks = document.querySelectorAll('header nav a');

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
  });
});

/* 섹션에 왔을 때 표시 */
document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll("header nav a");

  function onScroll() {
    let currentId = null;

    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const offset = 150; // 헤더 높이 감안해서 여유

      if (rect.top <= offset && rect.bottom > offset) {
        currentId = section.id;
      }
    });

    if (!currentId) return;

    navLinks.forEach(link => {
      const hrefId = link.getAttribute("href").replace("#", "");
      if (hrefId === currentId) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  window.addEventListener("scroll", onScroll);
  onScroll(); // 처음 로드 시 한 번 실행
});

/* ham menu */
const navUl = document.querySelector('nav ul');
document.querySelector('header').addEventListener('click', (e) => {
  if (window.innerWidth <= 375) {
    navUl.classList.toggle('active');
  }
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
const allClearImage = "url('./img/big.png')";   // 전부 먹었을 때 이미지

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
    emojiDropTarget.style.backgroundImage = "url('./img/eat.png')";

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


// 포크 한 번에 비우기 + 프로필 이모지 clear 이미지로 변경
document.addEventListener('DOMContentLoaded', () => {
  const emojiDropTarget = document.getElementById('emoji-profile');
  const dockContainer = document.querySelector('.dock_container');
  const trashIcon = document.querySelector('.dock_container .ico_bin');

  const allClearImage = './img/sun.png';

  if (trashIcon && dockContainer && emojiDropTarget) {
    trashIcon.style.cursor = 'pointer';

    trashIcon.addEventListener('click', () => {
      // 포크 제외 모든 아이콘 제거
      const allItems = dockContainer.querySelectorAll('li');
      allItems.forEach(li => {
        if (!li.classList.contains('li_bin')) {
          li.remove();
        }
      });

      // 프로필 이모지를 clear 이미지로 변경
      emojiDropTarget.style.backgroundImage = `url(${allClearImage})`;

      //  프로필 아래 힌트 문구 변경
      const emojiHint = document.querySelector('.emoji_hint');
      if (emojiHint) {
        emojiHint.textContent = '모든 스킬 흡수 완료!';
      }

      // 아래 문구 제거
      const dockHint = document.querySelector('.dock_hint');
      if (dockHint) {
        dockHint.remove();
      }
    });
  }
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



/* section3: publishing 3D slider */
document.addEventListener('DOMContentLoaded', () => {
  const publishingProjects = [
    {
      title: '01 WEB Team Projects',
      image: 'img/web.png',
      video: 'img/boj.mp4',
      link: 'https://hamsunghee.github.io/Beauty-of-Joseon/',
      plan: 'https://zrr.kr/d4XwAn',
      description: '한국 전통 미학과 현대적 UX를 결합해 글로벌 사용자를 위한 K-뷰티 브랜드 경험을 재정의하여 브랜드 경험과 구매 전환율 향상을 목표로 한 UX/UI 리뉴얼 팀 프로젝트 입니다.'
    },
    {
      title: '02 APP Team Projects',
      image: 'img/appmockup.png',
      video: 'img/heai.mp4',
      link: 'https://zrr.kr/Wwyeky',
      plan: 'https://zrr.kr/DhY3WD',
      description: '루틴 실패 이후에도 다시 시작할 수 있도록 돕는 AI 루틴 파트너 기반의 운동·감정 통합 앱으로, 회복 중심 UX와 상호작용 설계를 통해 사용자의 루틴 지속성과 감정적 몰입을 강화한 팀 프로젝트입니다.'
    },
    {

      title: '03 Knotted Projects',
      image: 'img/k2.png',
      video: 'img/knotted.mp4',
      link: '#https://hamsunghee.github.io/Knottedstore/',
      description: '기존 노티드의 브랜드 아이덴티티를 유지하면서 웹 사용성 관점에서 구조를 개선한 반응형 레이아웃과 인터랙티브 요소를 구현해 디바이스 환경에 관계없이 몰입감 있는 브랜드 경험을 제공한 프로젝트 입니다.'
    },
    {
      title: '04 Flash fit Projects',
      image: 'img/p_app.png',
      video: 'img/p_app.mp4',
      link: 'https://zrr.kr/AKILUv',
      plan: 'https://zrr.kr/bqAJAq',
      description: '쇼핑, 스타일링, 리셀로 분절된 패션 경험을 AI 체형 기반 추천으로 연결해, 사용자의 선택 피로를 줄이고 구매와 순환 거래를 자연스럽게 유도한 통합 패션 플랫폼 입니다.'
    },
    {
      title: '05 BUD Projects',
      image: 'img/bud.png',
      video: 'img/bud.mp4',
      link: 'https://zrr.kr/hc0WQ4',
      plan: 'https://zrr.kr/OKcPVE',
      description: '버드와이저 브랜드 감성과 음악·이벤트 콘텐츠를 결합해, 탐색 동선을 최소화하고 체험형 UX로 체류 시간·CTA 클릭률을 개선한 웹 리뉴얼 프로젝트 입니다'
    },
  ];

  let publishingIndex = 0;
  const container = document.getElementById('publishingSwiper');
  if (!container) return;

  const titlesList = document.getElementById('publishingTitles');
  const videoEl = document.getElementById('publishingVideo');
  const linkEl = document.getElementById('publishingLink');
  const planEl = document.getElementById('publishingPlan');
  const bannerTitle = document.getElementById('publishingBannerTitle');
  const descriptionEl = document.getElementById('publishingDescription');
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
      if (index === publishingIndex) {
        if (project.link && project.link !== '#') {
          window.open(project.link, '_blank');
        }
      } else {
        goToPublishingSlide(index);
      }
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

      let offset = index - publishingIndex;
      const totalSlides = slides.length;

      // Looping logic: find shortest path
      if (offset > totalSlides / 2) {
        offset -= totalSlides;
      } else if (offset < -totalSlides / 2) {
        offset += totalSlides;
      }
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
      linkEl.href = publishingProjects[publishingIndex].link || '#';
      if (planEl) {
        if (publishingProjects[publishingIndex].plan) {
          planEl.style.display = '';
          planEl.href = publishingProjects[publishingIndex].plan;
        } else {
          planEl.style.display = 'none';
        }
      }
      bannerTitle.textContent = publishingProjects[publishingIndex].title;
      if (descriptionEl) descriptionEl.textContent = publishingProjects[publishingIndex].description || '';
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
  // 가로 스크롤: 세로 스크롤을 슬라이드 이동으로 매핑
  const publishingSection = document.getElementById('publishing');
  if (publishingSection && publishingProjects.length > 1) {
    const slidesCount = publishingProjects.length;

    gsap.registerPlugin(ScrollTrigger);

    gsap.timeline({
      scrollTrigger: {
        trigger: publishingSection,
        start: 'top top',
        end: () => `+=${window.innerHeight * Math.max(1, slidesCount * 0.6)}`,
        scrub: 0.05,
        pin: true,
        snap: 1 / (slidesCount - 1),
        onUpdate: self => {
          const prog = self.progress;
          const floatIndex = prog * (slidesCount - 1);
          const newIndex = Math.round(floatIndex);
          if (newIndex !== publishingIndex) {
            publishingIndex = newIndex;
            updatePublishingSlides();
          }
        }
      }
    });
  }
});





// 05 .con4 .listBox .box ScrollTrigger Animation
/* gsap.utils.toArray('.con4 .listBox .box').forEach((selector) => {
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

 */
gsap.registerPlugin(ScrollTrigger);

// con4 애니메이션 - 초기 상태 보장
gsap.utils.toArray('.con4 .listBox .box').forEach((box, index) => {
  //  1. DOM 완전 로딩 후 초기화
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initBox(box);
    });
  } else {
    initBox(box);
  }

  function initBox(box) {
    // 초기화 (CSS무시)
    gsap.set(box, {
      rotationX: 0,
      scale: 1,
      brightness: 1,
      filter: 'brightness(1)',
      transformOrigin: 'top center',
      force3D: true,
      clearProps: 'all' // 기존 CSS 속성 완전 삭제
    });

    //  약간의 딜레이 후 애니메이션 시작
    setTimeout(() => {
      gsap.to(box, {
        rotationX: -10,
        scale: 0.9,
        filter: 'brightness(0.3)',
        scrollTrigger: {
          trigger: box,
          start: 'top 30%',
          end: 'bottom 10%',
          scrub: 1,
          /*           snap: 10, */
          // markers: true,
          onEnter: () => console.log('Start:', box), // 디버깅
        }
      });
    }, 100 + index * 2500); // 순서대로 50ms씩 지연
  }
});

// 4️⃣ 강제 새로고침
setTimeout(() => ScrollTrigger.refresh(), 500);



// macOS Dock 애니메이션 
/* const faceImages = [
  "url('./img/normal.png')",
  "url('./img/beard.png')",
  "url('./img/v.png')",
  "url('./img/herg.png')",
  "url('./img/shh.png')",
  "url('./img/good.png')"
];
let currentIndex = 0;

const btn = document.getElementById('emoji-profile');
btn.style.backgroundImage = faceImages[0]; 

btn.addEventListener('click', function () {
  currentIndex = (currentIndex + 1) % faceImages.length;
  const nextImage = faceImages[currentIndex];
  console.log('변경:', currentIndex, nextImage);  
  this.style.backgroundImage = nextImage;
});


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
 */

/* dock */
// macOS Dock 애니메이션 + 드래그 + 리셋 (8개 먹기 herg.png + 포크 sun.png)
document.addEventListener('DOMContentLoaded', () => {
  // 이모지 변경 기능
  (function () {
    const emojiFaceImages = [
      "url('./img/normal.png')",
      "url('./img/beard.png')",
      "url('./img/v.png')",
      "url('./img/herg.png')",
      "url('./img/shh.png')",
      "url('./img/good.png')"
    ];

    let emojiCurrentIndex = 0;
    const emojiBtn = document.getElementById('emoji-profile');

    if (!emojiBtn) return;

    // 초기 이미지
    emojiBtn.style.backgroundImage = emojiFaceImages[0];

    emojiBtn.addEventListener('click', () => {
      emojiCurrentIndex = (emojiCurrentIndex + 1) % emojiFaceImages.length;
      emojiBtn.style.backgroundImage = emojiFaceImages[emojiCurrentIndex];
    });
  })();
});

// dock 전체 기능 초기화
initDockSystem();

// 휴지통 리셋 기능
const dockResetBtn = document.querySelector('.reset_btn');
if (dockResetBtn) {
  dockResetBtn.addEventListener('click', resetDockSystem);
}

// 포크 클릭 기능 (sun.png + 스킬만 제거)
const forkIcon = document.querySelector('.li_bin .ico');
if (forkIcon) {
  forkIcon.addEventListener('click', handleForkClick);
};

// dock 먹힌 개수 카운터 (전역) - 드래그로 먹은 아이콘 수
let dockEatenCount = 0;

// dock 시스템 초기화
function initDockSystem() {
  const dockIcons = document.querySelectorAll('.dock_container .ico:not(.ico_bin)');
  const dropTarget = document.getElementById('emoji-profile');

  // 1. Hover 애니메이션 (독립 변수)
  const hoverReset = () => {
    dockIcons.forEach(icon => {
      icon.style.transform = 'scale(1) translateY(0px)';
    });
  };

  const hoverFocus = (index) => {
    hoverReset();
    const hoverTransformations = [
      { idx: index - 2, scale: 1.1, translateY: 0 },
      { idx: index - 1, scale: 1.2, translateY: -6 },
      { idx: index, scale: 1.5, translateY: -15 },
      { idx: index + 1, scale: 1.2, translateY: -6 },
      { idx: index + 2, scale: 1.1, translateY: 0 }
    ];
    hoverTransformations.forEach(({ idx, scale, translateY }) => {
      if (dockIcons[idx]) {
        dockIcons[idx].style.transform = `scale(${scale}) translateY(${translateY}px)`;
      }
    });
  };

  // 기존 이벤트 제거 후 새로 연결 (중복 방지)
  dockIcons.forEach(icon => {
    icon.replaceWith(icon.cloneNode(true));
  });

  const newDockIcons = document.querySelectorAll('.dock_container .ico:not(.ico_bin)');

  newDockIcons.forEach((icon, index) => {
    icon.draggable = true;
    icon.addEventListener('mouseenter', () => hoverFocus(index));
    icon.addEventListener('mouseleave', hoverReset);

    // 드래그 이벤트
    icon.addEventListener('dragstart', (e) => {
      e.dataTransfer.effectAllowed = 'move';
      icon.classList.add('dragging');
      icon.style.opacity = '0.6';
      icon.style.transform = 'scale(1.2) translateY(-8px)';
    });

    icon.addEventListener('dragend', () => {
      icon.classList.remove('dragging');
      icon.style.opacity = '1';
      icon.style.transform = '';
    });
  });

  // 2. 드롭 영역 이벤트 (8개 먹기 완전 구현)
  if (dropTarget) {
    // 기존 이벤트 제거
    dropTarget.replaceWith(dropTarget.cloneNode(true));
    const newDropTarget = document.getElementById('emoji-profile');

    newDropTarget.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      newDropTarget.classList.add('drop-active');
    });

    newDropTarget.addEventListener('dragleave', () => {
      newDropTarget.classList.remove('drop-active');
    });

    newDropTarget.addEventListener('drop', (e) => {
      e.preventDefault();
      newDropTarget.classList.remove('drop-active');

      const draggingIcon = document.querySelector('.dragging');
      if (draggingIcon && !draggingIcon.classList.contains('ico_bin')) {
        const parentLi = draggingIcon.closest('li');
        if (parentLi && !parentLi.classList.contains('reset_btn')) {
          parentLi.remove();
          dockEatenCount++; // 카운트 증가
          console.log(`🍖 먹은 개수: ${dockEatenCount}/8`);

          // 8개 다 먹으면 herg.png (영구)
          if (dockEatenCount >= 8) {
            newDropTarget.style.backgroundImage = "url('./img/sun.png')";
            console.log('🎉 8개 완전 먹기 완료! herg.png 영구 표시!');
          } else {
            // eat 애니메이션
            newDropTarget.style.backgroundImage = "url('./img/eat.png')";
            setTimeout(() => {
              newDropTarget.style.backgroundImage = "url('./img/normal.png')";
            }, 600);
          }
        }
      }
    });
  }
}

// 포크 클릭: sun.png + 스킬(li_1~li_8)만 제거, reset_btn 보존
function handleForkClick() {
  console.log('🍴 포크 클릭!');

  const dockContainer = document.querySelector('.dock_container');
  const dropTarget = document.getElementById('emoji-profile');

  // li_1 ~ li_8 만 삭제 (포크 li_bin, reset_btn 은 살려둠)
  const allItems = dockContainer.querySelectorAll('li');
  allItems.forEach(li => {
    if (li.classList.contains('li_1') ||
      li.classList.contains('li_2') ||
      li.classList.contains('li_3') ||
      li.classList.contains('li_4') ||
      li.classList.contains('li_5') ||
      li.classList.contains('li_6') ||
      li.classList.contains('li_7') ||
      li.classList.contains('li_8')) {
      li.remove();
    }
  });

  // 이모지 sun.png로 변경
  if (dropTarget) {
    dropTarget.style.backgroundImage = "url('./img/sun.png')";
  }

  // 포크로 모두 먹인 상태로 간주
  dockEatenCount = 8;
}

// dock 리셋 시스템
function resetDockSystem() {
  console.log('🔄 휴지통 리셋 실행!');

  const dockContainer = document.querySelector('.dock_container');
  const dropTarget = document.getElementById('emoji-profile');

  // 1. li_bin(포크), reset_btn 제외하고 삭제
  const allItems = dockContainer.querySelectorAll('li');
  allItems.forEach(li => {
    if (!li.classList.contains('li_bin') && !li.classList.contains('reset_btn')) {
      li.remove();
    }
  });

  // 2. 원본 8개 ico 재생성
  const resetIconsData = [
    { class: 'li_1', name: 'Figma', img: 'img/figma.png', alt: 'figma' },
    { class: 'li_2', name: 'AI', img: 'img/ai.png', alt: 'ai' },
    { class: 'li_3', name: 'PS', img: 'img/ps.png', alt: 'ps' },
    { class: 'li_4', name: 'HTML', img: 'img/html.png', alt: 'html' },
    { class: 'li_5', name: 'CSS', img: 'img/css.png', alt: 'css' },
    { class: 'li_6', name: 'JS', img: 'img/javascript.png', alt: 'js' },
    { class: 'li_7', name: 'Midjourney', img: 'img/midjourney.png', alt: 'midjourney' },
    { class: 'li_8', name: 'Chatgpt', img: 'img/chatgpt.webp', alt: 'chatgpt' }
  ];

  const forkIcon = dockContainer.querySelector('.li_bin');
  resetIconsData.forEach(iconData => {
    const newLi = document.createElement('li');
    newLi.className = iconData.class;
    newLi.innerHTML = `
            <div class="name">${iconData.name}</div>
            <img class="ico" src="${iconData.img}" alt="${iconData.alt}" draggable="true">
        `;
    dockContainer.insertBefore(newLi, forkIcon);
  });

  // 3. 상태 초기화
  dockEatenCount = 0;
  if (dropTarget) {
    dropTarget.style.backgroundImage = "url('./img/normal.png')";
  }

  // 4. 기능 재연결
  setTimeout(initDockSystem, 150);
  console.log('✅ dock 완전 리셋 완료!');
}

// 초기 실행
initDockSystem();



AOS.init({
  duration: 700,
  easing: 'ease-out',
  once: false,
  mirror: true,
  offset: 120
});

/* top */
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


//footer

document.addEventListener("DOMContentLoaded", () => {
  const flyingEls = document.querySelectorAll(".flying-text");

  flyingEls.forEach(el => {
    const text = el.textContent.trim();
    el.textContent = "";
    text.split("").forEach(ch => {
      const span = document.createElement("span");
      span.classList.add("char");
      span.textContent = ch;
      el.appendChild(span);
    });

    const chars = el.querySelectorAll(".char");

    gsap.fromTo(chars,
      {
        y: 40,
        opacity: 0,
        rotateX: -90
      },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        stagger: 0.08,
        duration: 1.2,
        ease: "back.out(1.7)",
        repeat: -1,
        repeatDelay: 1.2,
        yoyo: true
      }
    );
  });
});