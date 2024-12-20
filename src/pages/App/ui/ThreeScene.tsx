import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const ThreeScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Создаём сцену, камеру и рендерер
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current?.appendChild(renderer.domElement);

    // 2. Загружаем 3D модель
    const loader = new GLTFLoader();
    let model: THREE.Group | null = null;

    loader.load(
      "/ChristmasTree.glb", // Путь к 3D-модели
      (gltf) => {
        model = gltf.scene;
        model.position.set(0, -1, 0); // Настройка позиции модели
        model.scale.set(0.05, 0.05, 0.05); // Настройка масштаба модели
        scene.add(model);
      },
      undefined,
      (error) => {
        console.error("Ошибка загрузки модели:", error);
      }
    );

    // 3. Добавляем свет
    const light = new THREE.PointLight(0xffffff, 25, 100);
    light.position.set(2, 2, 2);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    scene.background = new THREE.Color(0xffffff);

    // 4. Устанавливаем позицию камеры
    camera.position.z = 3;

    // 5. Переменные для вращения
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    // 6. Обработка событий мыши
    const onMouseDown = (event: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: event.clientX, y: event.clientY };
    };

    const onMouseMove = (event: MouseEvent) => {
      if (isDragging && model) {
        const deltaMove = {
          x: event.clientX - previousMousePosition.x,
          y: event.clientY - previousMousePosition.y,
        };

        // Вращение модели по оси Y
        model.rotation.y += deltaMove.x * 0.01;

        previousMousePosition = { x: event.clientX, y: event.clientY };
      }
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onMouseLeave = () => {
      isDragging = false;
    };

    // Обработка масштабирования колесом мыши
    const onWheel = (event: WheelEvent) => {
      // const zoomSpeed ;
      // camera.position.z ;
      // Ограничиваем масштабирование
    };

    // Привязка событий мыши
    mountRef.current?.addEventListener("mousedown", onMouseDown);
    mountRef.current?.addEventListener("mousemove", onMouseMove);
    mountRef.current?.addEventListener("mouseup", onMouseUp);
    mountRef.current?.addEventListener("mouseleave", onMouseLeave);
    mountRef.current?.addEventListener("wheel", onWheel);

    // 7. Анимация
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();

    // 8. Обработка изменения размера окна
    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    // Очистка при размонтировании
    return () => {
      window.removeEventListener("resize", onResize);
      mountRef.current?.removeChild(renderer.domElement);

      mountRef.current?.removeEventListener("mousedown", onMouseDown);
      mountRef.current?.removeEventListener("mousemove", onMouseMove);
      mountRef.current?.removeEventListener("mouseup", onMouseUp);
      mountRef.current?.removeEventListener("mouseleave", onMouseLeave);
      mountRef.current?.removeEventListener("wheel", onWheel);
    };
  }, []);

  return <div ref={mountRef} style={{ width: "100vw", height: "100vh", cursor: "grab" }} />;
};

export default ThreeScene;
