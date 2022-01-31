import { WebGLRenderer, PerspectiveCamera, Scene, Color, Vector3, PointLight, Group } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export function setup3DScene(container: Group) {
  //create renderer, camera, and scene
  const renderer = new WebGLRenderer({ canvas: document.getElementById('my-canvas')!, antialias: true });
  const camera = new PerspectiveCamera(75, 0, 0.1, 100);
  const scene = new Scene();

  //set them up
  camera.position.z = 10;
  scene.background = new Color(0xeeeeee);

  //create lights
  setupLight(
    scene,
    new Vector3(0, 200, 0),
    new Vector3(0, -200, 0),
    // new Vector3(100, 200, 100),
    // new Vector3(-100, -200, -100),
    new Vector3(200, -50, 200),
    new Vector3(-200, 50, -200)
  );
  const controls = new OrbitControls(camera, renderer.domElement);

  //dont want controls to be able to pan
  controls.enablePan = false;
  controls.update();

  //add behälter to scene
  scene.add(container);

  //animation loop
  const animate = () => {
    //resize to current aspect ratio
    if (resizeRendererToDisplaySize()) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };

  function resizeRendererToDisplaySize() {
    const canvas = renderer.domElement;
    const pixelRatio = window.devicePixelRatio;
    const width = (canvas.clientWidth * pixelRatio) | 0;
    const height = (canvas.clientHeight * pixelRatio) | 0;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  animate();
}

function setupLight(sceneToAdd: Scene, ...vector3s: Vector3[]) {
  vector3s.forEach((v3) => {
    const light = new PointLight(0xffffff, 1, 0);
    light.position.set(v3.x, v3.y, v3.z);
    sceneToAdd.add(light);
  });
}
