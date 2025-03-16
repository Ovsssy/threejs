import './style.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DragControls } from 'three/examples/jsm/controls/DragControls.js';

const scene = new THREE.Scene();
const clock = new THREE.Clock();
let mixer;
// Создаем DirectionalLight
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0); // 1.0 - интенсивность
scene.add(directionalLight);

// Изменяем интенсивность
directionalLight.intensity = 2.5; // Увеличим в 2 раза

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setY(1);

renderer.render(scene, camera);

// const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
// const material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
// const torus = new THREE.Mesh(geometry, material);

// scene.add(torus);
scene.environment = null;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.329;
renderer.direct = 1;



const loader = new GLTFLoader();

loader.load('../Blend/Objects/Punch.glb', function (gltf) {
  const model = gltf.scene;
  scene.add(model);

  if (gltf.animations.length > 0) {
    mixer = new THREE.AnimationMixer(model);
    const action = mixer.clipAction(gltf.animations[0]);

    action.setLoop(THREE.LoopOnce);
    action.clampWhenFinished = true;
    action.play();

    const controls = new DragControls([model], camera, renderer.domElement);

    controls.addEventListener('dragstart', () => {
      console.log('Начало перетаскивания');
      if (mixer) mixer.stopAllAction(); // Останавливаем анимацию при начале перетаскивания
    });
  
    controls.addEventListener('dragend', () => {
      console.log('Конец перетаскивания');
      if (mixer) {
        const action = mixer.clipAction(gltf.animations[0]);
        action.play(); // Перезапускаем анимацию после перемещения
      }
    });
  }

}, undefined, function (error) {

  console.error(error);

});

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  if (mixer) mixer.update(delta);
  renderer.render(scene, camera);
}

animate();
