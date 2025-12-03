 
    const glassesBtn = document.getElementById('glassesBtn');
    const introScreen = document.querySelector('.intro-screen');
    const mainScreen = document.querySelector('.main-screen');
    const flash = document.querySelector('.flash');
    const curtainLeft = document.querySelector('.curtain.left');
    const curtainRight = document.querySelector('.curtain.right');
    const anaglyphText = document.querySelector('.anaglyph-text');
    const subtitle = document.querySelector('.subtitle');

    glassesBtn.addEventListener('click', () => {
      // 클릭 비활성화
      glassesBtn.style.pointerEvents = 'none';

      // 안경 효과 제거 (색상 분리 → 선명)
      anaglyphText.classList.remove('blurred');
      anaglyphText.classList.add('focused');
      subtitle.classList.remove('blurred');
      subtitle.classList.add('focused');

      // 플래시 효과 활성화 & 커튼 열기 & 인트로 숨김 & 메인 표시 순서대로 실행
      flash.classList.add('active');

      setTimeout(() => {
        curtainLeft.classList.add('open');
        curtainRight.classList.add('open');
      }, 300); // 플래시 효과 보이기 시작 후 커튼 오픈 트리거

      setTimeout(() => {
        introScreen.classList.add('hidden');
        mainScreen.classList.add('visible');
      }, 2100); // 커튼 연출 끝나면 인트로 숨기기

      setTimeout(() => {
        flash.classList.remove('active');
      }, 2500); // 플래시는 좀 더 늦게 제거
    });

    // 호버 효과
    glassesBtn.addEventListener('mouseenter', () => {
      glassesBtn.style.transform = 'scale(1.1) rotate(5deg)';
    });

    glassesBtn.addEventListener('mouseleave', () => {
      glassesBtn.style.transform = 'scale(1) rotate(0deg)';
    });
 