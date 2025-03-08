//Import the THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// To allow for the camera to move around the scene
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// To allow for importing the .gltf file
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

//Create a Three.JS Scene
const scene = new THREE.Scene();
//create a new camera with positions and angles
const camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 0.1, 1000);

//Keep track of the mouse position, so we can make the eye move
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

//Keep the 3D object on a global variable so we can access it later
let object;

//OrbitControls allow the camera to move around the scene
let controls;

//Set which object to render
let objToRender = 'mouse';

// let modelglb = `./models/aaaaa/${objToRender}.glb`;
let model = `./models/${objToRender}/scene.gltf`;



//Instantiate a loader for the .gltf file
const loader = new GLTFLoader();

//Load the file
loader.load(
  model,
  function (gltf) {
    //If the file is loaded, add it to the scene
    object = gltf.scene;
    scene.add(object);
  },
  function (xhr) {
    //While it is loading, log the progress
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    //If there is an error, log it
    console.error(error);
  }
);

//Instantiate a new renderer and set its size
const renderer = new THREE.WebGLRenderer({ alpha: true }); //Alpha: true allows for the transparent background
renderer.setSize(300, 300);

//Add the renderer to the DOM
document.getElementById("container3D").appendChild(renderer.domElement);

//Set how far the camera will be from the 3D model
camera.position.z = 0.3;
camera.position.x = 1;
camera.position.y = 1;


//Add lights to the scene, so we can actually see the 3D model
const dirLight1 = new THREE.DirectionalLight(0x7E7E7E, 10);
dirLight1.position.set(1, 8, 1);
scene.add(dirLight1);

const dirLight2 = new THREE.DirectionalLight(0x7E7E7E, 10);
dirLight2.position.set(-10, -8, -1);
scene.add(dirLight2);


const ambientLight = new THREE.AmbientLight(0x333333, 25);
scene.add(ambientLight);

//This adds controls to the camera, so we can rotate / zoom it with the mouse
controls = new OrbitControls(camera, renderer.domElement);

//Render the scene
function animate() {
  requestAnimationFrame(animate);
  //Here we could add some code to update the scene, adding some automatic movement

  //Make the mouse move
  if (object && objToRender === "mouse") {
    //I've played with the constants here until it looked good 
    object.rotation.y = -3 + mouseX / window.innerWidth * 3;
    object.rotation.x = -1.2 + mouseY * 2.5 / window.innerHeight;
  }

  const box = new THREE.Box3().setFromObject(object);
  const center = box.getCenter(new THREE.Vector3());
  object.position.sub(center); // Move o modelo para o centro (0,0,0)

  // Atualiza os controles (para movimentar a câmera)
  controls.update();

  renderer.render(scene, camera);

}



//Add a listener to the window, so we can resize the window and the camera
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(300, 300);
});

// //add mouse position listener, so we can make the mouse move
// document.onmousemove = (e) => {
//   mouseX = e.clientX;
//   mouseY = e.clientY;
// }

let isDragging = false;
let lastMouseX = 0;
let lastMouseY = 0;

function startDragObject(e) {
    isDragging = true;
    lastMouseX = (e.clientX || e.touches[0].clientX);
    lastMouseY = (e.clientY || e.touches[0].clientY);
}

function draggingObject(e) {
    if (isDragging && object) {
        mouseX = (e.clientX || e.touches[0].clientX) + lastMouseX * 0.01;
        mouseY = (e.clientY || e.touches[0].clientY) + lastMouseY * 0.01;
    }
}

function stopDragObject(e) {
    isDragging = false;
    if (object) {
        lastMouseX = (e.clientX || e.touches[0].clientX);
        lastMouseY = (e.clientY || e.touches[0].clientY);
    }
}

let dragAreaObject = document.getElementById("container3D");

// Eventos para mouse
dragAreaObject.addEventListener("mousedown", startDragObject);
document.addEventListener("mousemove", draggingObject);
document.addEventListener("mouseup", stopDragObject);

// Eventos para toque em tela
dragAreaObject.addEventListener("touchstart", startDragObject);
document.addEventListener("touchmove", draggingObject);
document.addEventListener("touchend", stopDragObject);


//Start the 3D rendering
animate();
