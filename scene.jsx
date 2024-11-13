import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const Scene = () => {
	const canvasRef = useRef(null);
	const [points, setPoints] = useState(0);
	const [message, setMessage] = useState("");
	const [foundObjects, setFoundObjects] = useState([]);
	const sceneRef = useRef(null);
	const rendererRef = useRef(null);
	const houseRef = useRef(null);
	const objectsToFind = ["rat", "camera", "table", "lamp"];

	useEffect(() => {
		console.log("Aantal canvassen in de DOM:", document.querySelectorAll("canvas").length);
		if (!canvasRef.current) return;

		// De scene, camera, renderer etc. worden maar één keer ingesteld
		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		const renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize(window.innerWidth, window.innerHeight);

		// Voeg de renderer als een DOM-element toe, alleen als het nog niet bestaat
		if (!canvasRef.current.contains(renderer.domElement)) {
			canvasRef.current.appendChild(renderer.domElement);
		}

		// Achtergrondkleur instellen
		renderer.setClearColor(0xb5b5b5);

		// Camera positie
		camera.position.z = 7.2;
		camera.position.y = 2;

		// Licht toevoegen
		const ambientLight = new THREE.AmbientLight(0x004040, 1);
		scene.add(ambientLight);
		const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
		directionalLight.position.set(20, 9, 5);
		scene.add(directionalLight);

		// OrbitControls
		const controls = new OrbitControls(camera, renderer.domElement);
		controls.minPolarAngle = Math.PI / 8;
		controls.maxPolarAngle = Math.PI / 2;

		// Sla de scène en renderer op in refs om herinitialisatie te voorkomen
		sceneRef.current = scene;
		rendererRef.current = renderer;

		// GLTFLoader instellen
		const loader = new GLTFLoader();

		// Models laden (rat en camera zijn interactief)
		const loadRat = () => {
			loader.load(
				"/public/Rat.gltf/rat.gltf",
				(gltf) => {
					const rat = gltf.scene;
					rat.name = "rat";
					rat.position.set(-3.2, 0, 4);
					rat.scale.set(1.2, 1.2, 1.2);

					scene.add(rat);
					console.log("Rat model loaded and added to scene");
				},
				undefined,
				(error) => console.error("Error loading rat model:", error)
			);
		};

		const loadCamera = () => {
			loader.load(
				"/public/Camera/Camera.gltf",
				(gltf) => {
					const cameraModel = gltf.scene;
					cameraModel.name = "camera";
					cameraModel.position.set(2, 0.57, 4);
					cameraModel.scale.set(1.5, 1.5, 1.5);

					// Voeg het camera-model toe aan de scène
					scene.add(cameraModel);

					console.log("Camera model loaded and added to scene");
				},
				undefined,
				(error) => console.error("Error loading camera model:", error)
			);
		};

		// Laad overige modellen
		const loadTable = () => {
			loader.load(
				"public/Tabel.gltf/Table.gltf", // Zorg ervoor dat het pad correct is
				(gltf) => {
					const table = gltf.scene;
					table.position.set(2, 0, 4);
					table.scale.set(1.3, 1.3, 1.4);
					scene.add(table);
				},
				undefined,
				(error) => console.error("Error loading table model:", error)
			);
		};
		const loadSpray = () => {
			loader.load(
				"public/spray.gltf/spray.gltf",
				(gltf) => {
					const spray = gltf.scene;
					spray.position.set(1.3, 0, 2);
					spray.scale.set(1, 1, 1);
					scene.add(spray);
					spray.rotation.y = Math.PI / 2;
				},
				undefined,
				(error) => console.error("Error loading spray model:", error)
			);
		};

		const loadLamp = () => {
			loader.load(
				"public/Lamp/Lamp.gltf", // Zorg ervoor dat het pad correct is
				(gltf) => {
					const lamp = gltf.scene;
					lamp.position.set(-2.2, -0.1, 3);
					lamp.scale.set(0.7, 0.7, 0.7);
					scene.add(lamp);
				},
				undefined,
				(error) => console.error("Error loading lamp model:", error)
			);
		};

		const loadHouse = () => {
			loader.load(
				"public/House/House.gltf",
				(gltf) => {
					const house = gltf.scene;
					house.position.set(0, 0, 0);
					house.scale.set(0.7, 0.7, 0.7);
					house.rotation.y = Math.PI / -2;
					scene.add(house);
					houseRef.current = house;
				},
				undefined,
				(error) => console.error("Error loading house model:", error)
			);
		};

		const loadCar = () => {
			loader.load(
				"public/Car/Car.gltf",
				(gltf) => {
					const car = gltf.scene;
					car.position.set(4, 0, 0);
					car.scale.set(0.7, 0.7, 0.7);
					car.rotation.y = Math.PI / 2;
					scene.add(car);
				},
				undefined,
				(error) => console.error("Error loading car model:", error)
			);
		};

		const loadTree = () => {
			loader.load(
				"public/Boom/Boom.gltf",
				(gltf) => {
					const tree = gltf.scene;
					tree.position.set(-4, -0.1, 0);
					tree.scale.set(1.5, 1.5, 1.5);
					scene.add(tree);
				},
				undefined,
				(error) => console.error("Error loading tree model:", error)
			);
		};
		const loadBaseball = () => {
			loader.load(
				"public/baseball.gltf/baseball.gltf",
				(gltf) => {
					const tree = gltf.scene;
					tree.position.set(5, 0.05, -0.69);
					tree.scale.set(1.5, 1.5, 1.5);
					scene.add(tree);
					tree.rotation.y = Math.PI / 2;
				},
				undefined,
				(error) => console.error("Error loading tree model:", error)
			);
		};
		const loadHandshoenen = () => {
			loader.load(
				"public/handschoenen.gltf/handschoenen.gltf",
				(gltf) => {
					const tree = gltf.scene;
					tree.position.set(0, 1.9, -2);
					tree.scale.set(1.5, 1.5, 1.5);
					scene.add(tree);
					tree.rotation.y = Math.PI / 2;
				},
				undefined,
				(error) => console.error("Error loading tree model:", error)
			);
		};

		// Laad alle modellen (maar het huis en de rat zullen alleen een keer geladen worden)
		loadRat();
		loadCamera();
		loadTable();
		loadSpray();
		loadLamp();
		loadHouse();
		loadCar();
		loadTree();
		loadBaseball();
		loadHandshoenen();

		// Raycasting voor interactieve objecten
		const raycaster = new THREE.Raycaster();
		const mouse = new THREE.Vector2();

		const onMouseClick = (event) => {
			mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
			mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

			raycaster.setFromCamera(mouse, camera);

			const intersects = raycaster.intersectObjects(scene.children, true); // true om door alle children heen te gaan
			if (intersects.length > 0) {
				let clickedObject = intersects[0].object;

				// Loop omhoog door de hiërarchie om het hoofdobject te vinden
				while (clickedObject.parent && clickedObject.name === "") {
					clickedObject = clickedObject.parent;
				}

				console.log("Clicked object:", clickedObject.name); // Log het geklikte object

				// Bereken de afstand tussen de muis en het object
				const mouseWorldPosition = intersects[0].point; // De plek waar de ray het object raakt
				const objectPosition = clickedObject.getWorldPosition(new THREE.Vector3());
				const distance = mouseWorldPosition.distanceTo(objectPosition); // Afstand tussen de muis en het object
				console.log("Afstand tot het object:", distance);

				// Verhoog de afstandsgrens voor een grotere detectiezone (bijvoorbeeld 2.5)
				const detectionRange = 9;

				// Als de afstand kleiner is dan de verhoogde range, een punt toevoegen
				if (distance < detectionRange) {
					if (clickedObject.name === "street_rat") {
						setPoints((prevPoints) => prevPoints + 1);
						setMessage("Je hebt de rat aangeklikt!");
					} else if (clickedObject.name === "Mesh016" || clickedObject.name === "folding_wooden_stool") {
						// Verberg "Mesh016" en de camera-objecten
						const cameraObject1 = scene.getObjectByName("Camera_01");
						const cameraObject2 = scene.getObjectByName("Camera_01_strap");

						if (cameraObject1) {
							cameraObject1.visible = false;
						}

						if (cameraObject2) {
							cameraObject2.visible = false;
						}

						setPoints((prevPoints) => prevPoints + 1);
						setMessage("Je hebt de camera aangeklikt! Camera verborgen.");
					} else if (clickedObject.name === "spray_paint_bottles_02") {
						const sprayObject1 = scene.getObjectByName("spray_paint_bottles_02");
						if (sprayObject1) {
							sprayObject1.visible = false;
						}
						setPoints((prevPoints) => prevPoints + 1);
						setMessage("Je hebt de spray aangeklikt! Spray verborgen.");
					} else if (clickedObject.name === "baseball_01") {
						const sprayObject1 = scene.getObjectByName("baseball_01");
						if (sprayObject1) {
							sprayObject1.visible = false;
						}
						setPoints((prevPoints) => prevPoints + 1);
						setMessage("Je hebt de baseball gevonden!");
					} else if (clickedObject.name === "Cube062_Material001_0" || clickedObject.name === "Cube511_Material001_0" || clickedObject.name === "garden_gloves_01") {
						const sprayObject1 = scene.getObjectByName("garden_gloves_01");
						if (sprayObject1) {
							sprayObject1.visible = false;
						}
						setPoints((prevPoints) => prevPoints + 1);
						setMessage("Je hebt de baseball gevonden!");
					}
				}
			} else {
				console.log("Geen object geraakt");
			}
		};

		renderer.domElement.addEventListener("click", onMouseClick);

		// Animatielus
		const animate = () => {
			requestAnimationFrame(animate);
			controls.update();
			renderer.render(scene, camera);
		};

		animate();

		return () => {
			window.removeEventListener("click", onMouseClick);
		};
	}, []);
	return (
		<div>
			<p>Punten: {points}</p>
			<p>{message}</p>
			<div ref={canvasRef} style={{ width: "100vw", height: "100vh" }}></div>
		</div>
	);
};

export default Scene;
