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



/*section5 mouse */
const hoverBg = document.querySelector('.hover-bg');
document.querySelectorAll('.project-row').forEach(item => {
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
