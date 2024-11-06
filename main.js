import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Maak een deur (rechthoekige doos)
const doorGeometry = new THREE.BoxGeometry(1, 3, 0.1); // Breedte, hoogte, diepte
const doorMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 }); // Houtkleur
const door = new THREE.Mesh(doorGeometry, doorMaterial);
scene.add(door);

// Plaats de deur in de scène
door.position.set(0, 1.5, 0); // Zet de deur op een hoogte van 1.5 (midden van de deur)

// Camera instellingen
camera.position.z = 5;

// Voeg lichten toe voor een mooier effect
const ambientLight = new THREE.AmbientLight(0x404040, 1); // Zacht omgevingslicht
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Sterk licht
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// OrbitControls voor beweging van de camera
const controls = new OrbitControls(camera, renderer.domElement);

// Animatie functie
let doorOpen = false; // Variabele om bij te houden of de deur open of dicht is
const openAngle = Math.PI / 2; // Hoe ver de deur opent (90 graden)
const closeAngle = 0; // Deur in gesloten positie (0 graden)

// Functie om de deur te openen of te sluiten
function toggleDoor() {
	doorOpen = !doorOpen; // Wisselt de status van de deur (open/dicht)
}

// Detectie van muisklik
window.addEventListener("click", () => {
	toggleDoor(); // Open of sluit de deur bij klik
});

// Animatie functie voor de deur
function animate() {
	requestAnimationFrame(animate);

	// Draai de deur open of dicht, afhankelijk van de status
	if (doorOpen) {
		if (door.rotation.y < openAngle) {
			door.rotation.y += 0.05; // De deur opent langzaam
		}
	} else {
		if (door.rotation.y > closeAngle) {
			door.rotation.y -= 0.05; // De deur sluit langzaam
		}
	}

	// Update orbit controls
	controls.update();

	// Render de scène
	renderer.render(scene, camera);
}

animate();

// Eventlistener om de deur ook te openen/sluiten met een toets
window.addEventListener("keydown", (event) => {
	if (event.key === " ") {
		// Spatiebalk om de deur te openen of te sluiten
		toggleDoor();
	}
});
