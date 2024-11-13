import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EXRLoader } from "three/examples/jsm/loaders/EXRLoader.js";

const Scene = () => {
	const canvasRef = useRef(null);
	const [points, setPoints] = useState(0);
	const [message, setMessage] = useState("");
	const [showStartScreen, setShowStartScreen] = useState(true);
	const [showEndScreen, setShowEndScreen] = useState(false);
	const [elapsedTime, setElapsedTime] = useState(0); // Time in seconds
	const [objectsToFind, setObjectsToFind] = useState(["Handschoen", "BaseBall", "Fototoestel", "Paarse graffiti spray"]);

	const timerRef = useRef(null); // For the interval timer
	const startTimeRef = useRef(null); // Store start time

	const startGame = () => {
		setShowStartScreen(false);
		setPoints(0);
		setMessage("");
		setShowEndScreen(false);
		setObjectsToFind(["Handschoen", "BaseBall", "Fototoestel", "Paarse graffiti spray"]);

		// Start the timer
		startTimeRef.current = Date.now();
		timerRef.current = setInterval(() => {
			setElapsedTime(Math.floor((Date.now() - startTimeRef.current) / 1000)); // Calculate elapsed time in seconds
		}, 1000);
	};

	useEffect(() => {
		// Check if the game is completed
		if (points === 4) {
			clearInterval(timerRef.current); // Stop the timer
			setShowEndScreen(true); // Show the end screen
		}
	}, [points]);

	useEffect(() => {
		if (showStartScreen || showEndScreen) return; // Do not continue if start or end screen is showing
		if (!canvasRef.current) return;

		console.log("Initializing the Three.js scene");
		// Scene, camera, renderer, etc. are set only once
		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		const renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize(window.innerWidth, window.innerHeight);

		// Add the renderer to the DOM if it hasn't been added already
		if (!canvasRef.current.contains(renderer.domElement)) {
			canvasRef.current.appendChild(renderer.domElement);
			console.log("Renderer added to the DOM");
		}

		camera.position.z = 7.2;
		camera.position.y = 2;

		// OrbitControls
		const controls = new OrbitControls(camera, renderer.domElement);
		controls.minPolarAngle = Math.PI / 8;
		controls.maxPolarAngle = Math.PI / 2;

		// Load background (EXR image) for the existing scene
		const loadBackground = () => {
			const exrLoader = new EXRLoader();
			exrLoader.load(
				"/public/Background2.exr", // Path to your EXR file
				(texture) => {
					const pmremGenerator = new THREE.PMREMGenerator(renderer);
					const envMap = pmremGenerator.fromEquirectangular(texture).texture;
					scene.background = envMap;
					scene.environment = envMap;

					texture.dispose();
					pmremGenerator.dispose();
				},
				undefined,
				(error) => console.error("Error loading EXR texture:", error)
			);
		};
		loadBackground();

		const textureLoader = new THREE.TextureLoader();

		// Load the three textures
		const groundTexture = textureLoader.load("/public/Grass/textures/leafy_grass_diff_1k.jpg");
		const bumpTexture = textureLoader.load("/public/Grass/textures/leafy_grass_arm_1k.jpg");
		const normalTexture = textureLoader.load("/public/Grass/textures/leafy_grass_nor_gl_1k.jpg");

		groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
		groundTexture.repeat.set(10, 10);

		bumpTexture.wrapS = bumpTexture.wrapT = THREE.RepeatWrapping;
		bumpTexture.repeat.set(10, 10);

		normalTexture.wrapS = normalTexture.wrapT = THREE.RepeatWrapping;
		normalTexture.repeat.set(10, 10);

		const groundMaterial = new THREE.MeshStandardMaterial({
			map: groundTexture,
			bumpMap: bumpTexture,
			bumpScale: 0.1,
			normalMap: normalTexture,
			normalScale: new THREE.Vector2(1, 1),
		});

		const ground = new THREE.Mesh(new THREE.PlaneGeometry(50, 50), groundMaterial);
		ground.rotation.x = -Math.PI / 2;
		ground.position.y = 0;
		scene.add(ground);

		const loader = new GLTFLoader();

		// Models laden
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
					house.position.set(0, 0.1, 0);
					house.scale.set(0.7, 0.7, 0.7);
					house.rotation.y = Math.PI / -2;
					scene.add(house);
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
					tree.position.set(0, 2, -2);
					tree.scale.set(1.5, 1.5, 1.5);
					scene.add(tree);
					tree.rotation.y = Math.PI / 2;
				},
				undefined,
				(error) => console.error("Error loading tree model:", error)
			);
		};
		const ton1 = () => {
			loader.load(
				"public/ton1.gltf/ton1.gltf",
				(gltf) => {
					const tree = gltf.scene;
					tree.position.set(-3.2, 0, 0.2);
					tree.scale.set(1, 1, 1);
					scene.add(tree);
				},
				undefined,
				(error) => console.error("Error loading tree model:", error)
			);
		};
		const ton2 = () => {
			loader.load(
				"public/ton2.gltf/ton2.gltf",
				(gltf) => {
					const tree = gltf.scene;
					tree.position.set(-3, 0, 1);
					tree.scale.set(1, 1, 1);
					scene.add(tree);
				},
				undefined,
				(error) => console.error("Error loading tree model:", error)
			);
		};
		const box = () => {
			loader.load(
				"public/box.gltf/box.gltf",
				(gltf) => {
					const tree = gltf.scene;
					tree.position.set(1.3, 0, -1);
					tree.scale.set(1, 1, 1);
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
		ton1();
		ton2();
		box();

		// Raycasting for interactive objects
		const raycaster = new THREE.Raycaster();
		const mouse = new THREE.Vector2();

		const onMouseClick = (event) => {
			mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
			mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

			raycaster.setFromCamera(mouse, camera);

			const intersects = raycaster.intersectObjects(scene.children, true);
			if (intersects.length > 0) {
				let clickedObject = intersects[0].object;

				while (clickedObject.parent && clickedObject.name === "") {
					clickedObject = clickedObject.parent;
				}

				console.log("Clicked object:", clickedObject.name);

				const mouseWorldPosition = intersects[0].point;
				const objectPosition = clickedObject.getWorldPosition(new THREE.Vector3());
				const distance = mouseWorldPosition.distanceTo(objectPosition);
				console.log("Distance to the object:", distance);

				const detectionRange = 9;
				// Als de afstand kleiner is dan de verhoogde range, een punt toevoegen
				if (distance < detectionRange) {
					if (clickedObject.name === "Mesh016" || clickedObject.name === "folding_wooden_stool") {
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
						setMessage("Je hebt de camera gevonden!");
						setObjectsToFind((prevItems) => prevItems.filter((item) => item !== "Fototoestel"));
					} else if (clickedObject.name === "spray_paint_bottles_02" || clickedObject.name === "spray_paint_bottles_02_dented") {
						const sprayObject1 = scene.getObjectByName("spray_paint_bottles_02");
						if (sprayObject1) {
							sprayObject1.visible = false;
						}
						setPoints((prevPoints) => prevPoints + 1);
						setMessage("Goed! Je hebt de spray gevonden!");
						setObjectsToFind((prevItems) => prevItems.filter((item) => item !== "Paarse graffiti spray"));
					} else if (clickedObject.name === "baseball_01") {
						const sprayObject1 = scene.getObjectByName("baseball_01");
						if (sprayObject1) {
							sprayObject1.visible = false;
						}
						setPoints((prevPoints) => prevPoints + 1);
						setMessage("Wow je hebt de baseball!");
						setObjectsToFind((prevItems) => prevItems.filter((item) => item !== "BaseBall"));
					} else if (clickedObject.name === "Cube062_Material001_0" || clickedObject.name === "Cube511_Material001_0" || clickedObject.name === "garden_gloves_01") {
						const sprayObject1 = scene.getObjectByName("garden_gloves_01");
						if (sprayObject1) {
							sprayObject1.visible = false;
						}
						setPoints((prevPoints) => prevPoints + 1);
						setMessage("Goed zo! Je hebt de handschoenen gevonden");
						setObjectsToFind((prevItems) => prevItems.filter((item) => item !== "Handschoen"));
					}
				}
			} else {
				console.log("Geen object geraakt");
			}
		};

		renderer.domElement.addEventListener("click", onMouseClick, false);

		// Animatielus
		const animate = () => {
			requestAnimationFrame(animate);
			controls.update();
			renderer.render(scene, camera);
		};

		animate();

		return () => {
			if (timerRef.current) {
				clearInterval(timerRef.current); // Timer stoppen bij demontage
			}
		};
	}, [showStartScreen, showEndScreen]);

	return (
		<>
			{showStartScreen ? (
				<div className="start-screen">
					<h1>Zoek de voorwerpen!</h1>
					<ul>
						{objectsToFind.map((item, index) => (
							<li key={index}>{item}</li>
						))}
					</ul>
					<button onClick={startGame}>Start</button>
				</div>
			) : showEndScreen ? (
				<div className="end-screen">
					<h1>Je hebt alles gevonden!</h1>
					<p>Het duurde {elapsedTime} seconden om alles te vinden.</p>
					<button onClick={() => setShowStartScreen(true)}>Opnieuw spelen</button>
				</div>
			) : (
				<>
					<div className="text">
						<p>Punten: {points}</p>
						<ul>
							{objectsToFind.map((item, index) => (
								<li key={index}>{item}</li>
							))}
						</ul>
						<p>{message}</p>
					</div>
					<div ref={canvasRef} style={{ width: "100vw", height: "100vh" }}></div>
				</>
			)}
		</>
	);
};

export default Scene;
