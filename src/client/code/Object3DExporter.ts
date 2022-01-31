import { Object3D } from 'three';
import { GLTFExporter, GLTFExporterOptions } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { USDZExporter } from 'three/examples/jsm/exporters/USDZExporter';

/**
 * Class that contains functionality to export a given 3D Scene
 * into a file blob of GLTF or USDZ
 */
class Object3DExporter {
  constructor() {}

  /**
   * Export Object3D into a GLTF
   * @param {Object3D} input Object3D to be converted
   * @param {Promise<Blob>} options
   */
  public exportGLTF(input: Object3D, options: GLTFExporterOptions = {}): Promise<Blob> {
    return new Promise<Blob>((res, rej) => {
      const exporter = new GLTFExporter();
      const mimeType = 'text/plain';

      exporter.parse(
        input,
        (result) => {
          const parsedValue = JSON.stringify(result, null, 2);
          const blob = this.createBlob(parsedValue, mimeType);
          res(blob);
        },
        options
      );
    });
  }

  /**
   * Export a Object3D into a USDZ
   * Warning: Only MeshStandardMaterial works properly
   * @param {Object3D} input Object3D to be converted
   * @return {Promise<Boolean>}
   */
  public async exportUSDZ(input: Object3D): Promise<Blob> {
    const exporter = new USDZExporter();
    const mimeType = 'application/octet-stream';

    return exporter.parse(input).then((parsedValue) => this.createBlob(parsedValue, mimeType));
  }

  /**
   * create blob from given parameters.
   * @param  {BlobPart} buffer
   * @param  {string} mimeType
   * @return {Blob}
   */
  private createBlob(buffer: BlobPart, mimeType: string): Blob {
    const blob = new Blob([buffer], { type: mimeType });
    return blob;
  }
}

export { Object3DExporter };
