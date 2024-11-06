import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Stel de achtergrondkleur in
renderer.setClearColor(0xb5b5b5); // Lichtblauwe achtergrond

// Camera instellingen
camera.position.z = 10;

// Voeg lichten toe voor een mooier effect
const ambientLight = new THREE.AmbientLight(0x404040, 1);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// OrbitControls voor beweging van de camera
const controls = new OrbitControls(camera, renderer.domElement);

// Laad de tafel met GLTFLoader
const loader = new GLTFLoader();
loader.load(
	new URL("../3DObject/public/Tabel.gltf/table.gltf", import.meta.url).href,
	(gltf) => {
		const table = gltf.scene;
		table.position.set(2, 0, 4);
		table.scale.set(1.3, 1.3, 1.4);
		scene.add(table);
	},
	undefined,
	(error) => {
		console.error("Er was een probleem bij het laden van het GLTF-model:", error);
	}
);

// Laad de lamp
const loader2 = new GLTFLoader();
loader2.load(
	new URL("../3DObject/public/Lamp/lamp.gltf", import.meta.url).href,
	(gltf) => {
		const lamp = gltf.scene;
		lamp.position.set(-2, 0, 5);
		lamp.scale.set(0.7, 0.7, 0.7);
		scene.add(lamp);
	},
	undefined,
	(error) => {
		console.error("Er was een probleem bij het laden van het GLTF-model:", error);
	}
);

// Laad het huis
const loader3 = new GLTFLoader();
loader3.load(
	new URL("../3DObject/public/House/house.gltf", import.meta.url).href,
	(gltf) => {
		const house = gltf.scene;
		house.position.set(0, 0, 0);
		house.scale.set(0.7, 0.7, 0.7);
		house.rotation.y = Math.PI / -2;
		scene.add(house);
	},
	undefined,
	(error) => {
		console.error("Er was een probleem bij het laden van het GLTF-model:", error);
	}
);
const loader4 = new GLTFLoader();
loader4.load(
	new URL("../3DObject/public/Car/Car.gltf", import.meta.url).href,
	(gltf) => {
		const house = gltf.scene;
		house.position.set(4, 0, 0);
		house.scale.set(0.7, 0.7, 0.7);
		house.rotation.y = Math.PI / 2;
		scene.add(house);
	},
	undefined,
	(error) => {
		console.error("Er was een probleem bij het laden van het GLTF-model:", error);
	}
);

function animate() {
	requestAnimationFrame(animate);
	controls.update();
	renderer.render(scene, camera);
}

animate();
