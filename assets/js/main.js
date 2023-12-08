import * as THREE from 'three';
// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(
//     100,
//     window.innerWidth / window.innerHeight,
//     0.1,
//     1000
// );
// const renderer = new THREE.WebGL1Renderer(
//     {
//         animation:true
//     }
// );
// renderer.setSize(window.innerWidth , window.innerHeight);
// document.body.appendChild(renderer.domElement);

// window.addEventListener('resize' , ()=>{
//     const width =window.innerWidth;
//     const height=window.innerHeight;
//     renderer.setSize(width,height);
//     camera.aspect = width / height;
//     camera.updateProjectionMatrix();
// })
// const texture = new THREE.TextureLoader().load('./assets/images/car.png')
// const secondTexture = new THREE.TextureLoader().load('./assets/images/remote.png')

// texture.repeat.set(0.6, 0.6);
// const geometry = new THREE.BoxGeometry(2, 2, 2);
// const material = new THREE.MeshBasicMaterial(
//     {
//         // color:0x00ff21,
//         wireframe:false,
//         map:texture,
//         map:secondTexture
//     }
// );
// const cube = new THREE.Mesh(geometry,material);
// scene.add(cube);
// camera.position.z=5;
 
// function animation() {
//     requestAnimationFrame(animation);
//     cube.rotation.z +=0.01;
//     // cube.rotation.y +=0.01;
//     // cube.rotation.x +=0.01;

//     renderer.render(scene,camera);
// }
// animation()

import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.124.0/examples/jsm/controls/OrbitControls.js";

const canvas = document.querySelector("#canvas");
const leftZoomBtn = document.querySelector(".left-box-btn");
const originalBtn = document.querySelector(".original-btn");
const rightZoomBtn = document.querySelector(".right-box-btn");

let scene, camera, renderer;

let rotateAroundGroup = true;

scene = new THREE.Scene();
scene.background = new THREE.Color("#000e41");

// const axesHelper = new THREE.AxesHelper(3);
// scene.add(axesHelper);

camera = new THREE.PerspectiveCamera(
	45,
	canvas.clientWidth / canvas.clientHeight,
	0.1,
	100
);
camera.position.set(0, 0, 15);

const light = new THREE.HemisphereLight(0xffffff, "cornflowerblue", 1);
scene.add(light);

const group = new THREE.Group();

// const geometry = new THREE.BoxBufferGeometry(1, 1, 1);
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshPhongMaterial();

const material1 = new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load('path/to/texture1.jpg') });
const material2 = new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load('path/to/texture2.jpg') });
const box = new THREE.Mesh(geometry, material);
box.position.set(-4, -1, 2);
group.add(box);

const box2 = new THREE.Mesh(geometry, material);
box2.position.set(4, 3.5, -2);
group.add(box2);

const sphere = new THREE.Mesh(
	new THREE.SphereGeometry(1, 32, 32),
	new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true })
);
group.add(sphere);

scene.add(group);

renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputEncoding = THREE.sRGBEncoding;
canvas.appendChild(renderer.domElement);

const zoomInTimeline = (x, y, z, zoomOutFactor = 0) => {
	let tl = gsap
		.timeline({ defaults: { duration: 1.5, ease: "expo.out" } })
		.to(controls.target, { x, y, z })
		.to(camera.position, { x, y, z: z + zoomOutFactor }, 0)
		.to(group.rotation, { x: 0, y: 0 }, 0);
};

leftZoomBtn.addEventListener("click", () => {
	zoomInTimeline(box.position.x, box.position.y, box.position.z, 5);
	rotateAroundGroup = false;
});

originalBtn.addEventListener("click", () => {
	zoomInTimeline(0, 0, 0, 15);
	rotateAroundGroup = true;
});

rightZoomBtn.addEventListener("click", () => {
	zoomInTimeline(box2.position.x, box2.position.y, box2.position.z, 5);
	rotateAroundGroup = false;
});

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableRotate = false;

const onWindowResize = () => {
	camera.aspect = canvas.clientWidth / canvas.clientHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(canvas.clientWidth, canvas.clientHeight);
};

window.addEventListener("resize", onWindowResize, false);

const clock = new THREE.Clock();

const animate = () => {
	const elapsedTime = clock.getElapsedTime();

	box.rotation.x = elapsedTime;
	box.rotation.y = elapsedTime;
	box.scale.x = Math.sin(elapsedTime) + 2;
	box.scale.y = Math.cos(elapsedTime) + 2;

	box2.rotation.x = elapsedTime * 2;
	box2.rotation.y = elapsedTime * 2;

	if (rotateAroundGroup) {
		group.rotation.y = Math.cos(elapsedTime) * 0.75;
		group.rotation.x = Math.sin(elapsedTime) * 0.5;
	}

	renderer.render(scene, camera);
	requestAnimationFrame(animate);
};

animate();



/* mouse cursor js open */
$(window).mousemove(function (e) {
    $(".ring").css(
        "transform",
        `translateX(calc(${e.clientX}px - 1.25rem)) translateY(calc(${e.clientY}px - 1.25rem))`
    );
});
/* mouse cursor js closed */

