    // ===== 기본 세팅 =====
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 6);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000);
    document.body.appendChild(renderer.domElement);

    // ===== 조명 =====
    const light = new THREE.PointLight(0xffffff, 1.2);
    light.position.set(10, 10, 10);
    scene.add(light);

    const ambient = new THREE.AmbientLight(0x404040);
    scene.add(ambient);

    // ===== 텍스트로 캔버스 텍스처 만들기 =====
    const canvas = document.createElement("canvas");
    canvas.width = 2048;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = "bold 120px Helvetica";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const text = "Restart. Recover. Rise. • ";
    let drawX = canvas.width / 2;
    for (let i = 0; i < 12; i++) { // 더 많이 반복!
      ctx.fillText(text, drawX, canvas.height / 2);
      drawX += 400; // 텍스트 간 간격 (수정가능)
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 1);
    texture.needsUpdate = true;

    // ===== 토러스 메쉬 =====
    const geometry = new THREE.TorusGeometry(2, 0.4, 32, 128);
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      metalness: 0.4,
      roughness: 0.5,
      side: THREE.DoubleSide,
    });
    const torus = new THREE.Mesh(geometry, material);
    scene.add(torus);

    // ===== OrbitControls =====
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // ===== 애니메이션 =====
    function animate() {
      requestAnimationFrame(animate);
      torus.rotation.x += 0.002;
      torus.rotation.y += 0.004;

      // 텍스처가 자연스럽게 흐르게 (repeat 효과와 조합)
      texture.offset.x += 0.003;

      controls.update();
      renderer.render(scene, camera);
    }

    animate();

    // ===== 리사이즈 대응 =====
    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
