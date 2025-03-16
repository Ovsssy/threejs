import './style.css';
import * as THREE from 'three';

// Инициализация сцены
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
document.body.appendChild(renderer.domElement);

// Настроим размер рендерера
renderer.setSize(window.innerWidth, window.innerHeight);

// Массив для хранения кубиков
const cubes = [];
const cubeCount = 30; // Количество кубиков (10 на каждую линию)

// Контур для кубиков
const outlineMaterial = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 });

// Создание кубиков и добавление их в сцену на трех линиях
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

for (let i = 0; i < cubeCount; i++) {
  const cube = new THREE.Mesh(geometry, material);

  // Располагаем кубики по 3 линиям (по оси X)
  const row = Math.floor(i / 10); // Индекс строки
  const column = i % 10; // Индекс столбца

  cube.position.x = column * 2 - 10; // Расстояние между кубиками по оси X
  cube.position.y = row * 1;   // Расстояние между строками по оси Y
  cube.position.z = 0; // Все кубики на одной плоскости

  cubes.push(cube);
  scene.add(cube);

  // Создаем контур для кубика
  const edges = new THREE.EdgesGeometry(geometry);
  const outline = new THREE.LineSegments(edges, outlineMaterial);
  cube.add(outline); // Добавляем контур к кубику
}

// Позиция камеры
camera.position.x = 10
camera.position.z = 20;

// Обработчик движения мыши
let mouseX = 0;
let mouseY = 0;
document.addEventListener('mousemove', (event) => {
  mouseX = (event.clientX / window.innerWidth) * 2 - 1; // Нормализуем координаты мыши
  mouseY = -(event.clientY / window.innerHeight) * 2 + 1; // Нормализуем координаты мыши
});

// Анимация
function animate() {
  requestAnimationFrame(animate);

  // Для каждого кубика
  cubes.forEach(cube => {
    // Рассчитываем вектор направления на мышь
    const vector = new THREE.Vector3(mouseX * 10, mouseY * 10, 0); // Создаем вектор направления

    cube.lookAt(vector); // Поворачиваем кубик так, чтобы его передняя грань смотрела на мышь

    // Оправляем вращение, чтобы было плавным и не происходило вращение по другим осям
    cube.rotation.x = 0;
    cube.rotation.z = 0;
  });

  renderer.render(scene, camera);
}

animate();


