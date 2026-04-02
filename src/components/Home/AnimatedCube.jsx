import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { gsap } from 'gsap';
import './AnimatedCube.css';

export default function AnimatedCube() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ── Canvas ────────────────────────────────────────────────────
    const canvas = document.createElement('canvas');
    canvas.className = 'cube-canvas';
    container.appendChild(canvas);

    // ── Renderer ──────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    // ── Scene + Camera ────────────────────────────────────────────
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(2.8, 2.2, 4.2);
    camera.lookAt(0.2, 0.1, 0);

    function resize() {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    // ── Iluminación ───────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xeeeeff, 0.9));

    const key = new THREE.DirectionalLight(0xffffff, 3.5);
    key.position.set(-2.5, 5, 3.5);
    scene.add(key);

    const fill = new THREE.DirectionalLight(0xc8c5ff, 0.8);
    fill.position.set(4, -1, 2);
    scene.add(fill);

    const rim = new THREE.DirectionalLight(0xffffff, 0.4);
    rim.position.set(1, -2, -4);
    scene.add(rim);

    // ── Cubo redondeado ───────────────────────────────────────────
    const geo = new RoundedBoxGeometry(1.215, 1.215, 1.215, 8, 0.19);
    const mat = new THREE.MeshStandardMaterial({
      color:     new THREE.Color('#b8b4f2'),
      roughness: 0.85,
      metalness: 0.0,
    });
    const cube = new THREE.Mesh(geo, mat);
    cube.position.set(0.3, 0.2, 0);
    cube.rotation.y = THREE.MathUtils.degToRad(32);
    cube.rotation.x = THREE.MathUtils.degToRad(-15);
    scene.add(cube);

    // ── Rotación aleatoria GSAP ───────────────────────────────────
    const tweens = [];
    function randomRotate() {
      const tween = gsap.to(cube.rotation, {
        x: cube.rotation.x + (Math.random() - 0.5) * Math.PI * 2,
        y: cube.rotation.y + (Math.random() - 0.5) * Math.PI * 2,
        z: cube.rotation.z + (Math.random() - 0.3) * Math.PI,
        duration: 10,
        ease: 'power1.inOut',
        onComplete: randomRotate,
      });
      tweens.push(tween);
    }
    randomRotate();

    // ── Pentágono GSAP ────────────────────────────────────────────
    const pentagon = container.querySelector('.cube-pentagon');
    const pentTween = gsap.to(pentagon, {
      rotation: 360,
      duration: 28,
      ease: 'none',
      repeat: -1,
      transformOrigin: '50% 50%',
    });

    // ── Render loop ───────────────────────────────────────────────
    let rafId;
    function animate() {
      rafId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
    animate();

    // ── Cleanup ───────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId);
      tweens.forEach(t => t.kill());
      pentTween.kill();
      ro.disconnect();
      renderer.dispose();
      geo.dispose();
      mat.dispose();
      canvas.remove();
    };
  }, []);

  return (
    <div className="cube-wrapper" ref={containerRef}>
      <svg
        className="cube-pentagon"
        viewBox="0 0 163 172"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M60.9883 1.24196L0.826521 86.6989L63.4534 170.484L162.333 136.808L160.803 32.2151L60.9883 1.24196Z"
          stroke="#7874F4"
          strokeWidth="0.5"
          strokeMiterlimit="10"
        />
      </svg>
    </div>
  );
}
