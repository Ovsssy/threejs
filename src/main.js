import './style.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

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

const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
const torus = new THREE.Mesh(geometry, material);

scene.add(torus);
scene.environment = null;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.329; // Можно настроить уровень экспозиции
renderer.direct = 1; 



const loader = new GLTFLoader();

loader.load( '../Blend/Objects/Punch.glb', function ( gltf ) {
  const model = gltf.scene;
  scene.add(model);

  if (gltf.animations.length > 0) {
    mixer = new THREE.AnimationMixer(model);
    const action = mixer.clipAction(gltf.animations[0]); // Берем первую анимацию
    action.play();
}

}, undefined, function ( error ) {

	console.error( error );

} );

function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.01;

  const delta = clock.getDelta(); // Получаем разницу времени между кадрами
  if (mixer) mixer.update(delta); // Обновляем анимацию
  renderer.render(scene, camera);
}

animate();