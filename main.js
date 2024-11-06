import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Stel de achtergrondkleur in
renderer.setClearColor(0x87ceeb); // Lichtblauwe achtergrond

// Maak het huis (kubusvormige structuur)
const houseGeometry = new THREE.BoxGeometry(6, 4, 6);
const houseMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
const house = new THREE.Mesh(houseGeometry, houseMaterial);
scene.add(house);
house.position.y = 2; // Zet het huis op een kleine hoogte

// Maak de deur (rechthoekige doos)
const doorGeometry = new THREE.BoxGeometry(1, 2, 0.1);
const doorMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
const door = new THREE.Mesh(doorGeometry, doorMaterial);
scene.add(door);
door.position.set(0, 1, 3.05); // Plaats de deur voor het huis

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
		table.position.set(2, 0);
		table.scale.set(1, 1, 1);
		scene.add(table);
	},
	undefined,
	(error) => {
		console.error("Er was een probleem bij het laden van het GLTF-model:", error);
	}
);

// Animatie en interactie met deur
let doorOpen = false;
const openAngle = Math.PI / 2;
const closeAngle = 0;

function toggleDoor() {
	doorOpen = !doorOpen;
}

// Detectie van muisklik op de deur
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener("click", (event) => {
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
	raycaster.setFromCamera(mouse, camera);
	const intersects = raycaster.intersectObject(door);
	if (intersects.length > 0) {
		toggleDoor();
	}
});

function animate() {
	requestAnimationFrame(animate);
	if (doorOpen) {
		if (door.rotation.y < openAngle) {
			door.rotation.y += 0.05;
		}
	} else {
		if (door.rotation.y > closeAngle) {
			door.rotation.y -= 0.05;
		}
	}
	controls.update();
	renderer.render(scene, camera);
}

animate();

window.addEventListener("keydown", (event) => {
	if (event.key === " ") {
		toggleDoor();
	}
});
