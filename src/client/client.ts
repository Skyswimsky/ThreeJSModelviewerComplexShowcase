import { Object3DExporter } from './code/Object3DExporter';
import { TweakUI } from './code/client/TweakUI';
import { setup3DScene } from './code/client/Setup3DScene';
import { DataHandler } from './code/client/DataHandler';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker
      .register('./serviceWorker.js?v=4')
      .then((res) => console.log('Service worker registered'))
      .catch((err) => console.log('Service worker not registered', err));
  });
}
const dataHandler = new DataHandler();
const container = dataHandler.object3Dbehaelter;

setup3DScene(container);
new TweakUI(dataHandler.data, dataHandler.createContainer.bind(dataHandler), exportToMv, !getParametersExist());

//exports the Object3D into a GLTF and auto-starts AR functionality by clicking the AR button if it exists
//model-viewer auto transform GLTF into an iOS format
async function exportToMv() {
  const object3DExporter = new Object3DExporter();
  const modelviewer = document.getElementById('mv');
  const arBtn = document.getElementById('ar-button');
  let blob = await object3DExporter.exportGLTF(container);
  let blob2 = await object3DExporter.exportUSDZ(container);
  modelviewer?.setAttribute('src', URL.createObjectURL(blob));
  //modelviewer?.setAttribute('ios-src', URL.createObjectURL(blob2));
  arBtn?.click();
}

function getParametersExist(): boolean {
  return location.search.includes('?');
}

function checkArExists(): boolean {
  const modelviewer = document.getElementById('mv');
  //checks if AR button is enabled and if it is, the device has a high likely-hood to support AR
  const arEnabled = modelviewer?.shadowRoot?.querySelector('.ar-button.enabled');
  if (arEnabled) {
    return true;
  } else {
    return false;
  }
}
