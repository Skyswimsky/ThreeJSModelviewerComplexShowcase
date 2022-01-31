import { ConeGeometry, CylinderBufferGeometry, CylinderGeometry, Material, Mesh, SphereGeometry } from 'three';
import { BehaelterPart } from './BehaelterPart';

export abstract class BehaelterDeckel<T extends SphereGeometry | ConeGeometry> extends BehaelterPart<T> {
  protected top: boolean;
  constructor(height: number, diameter: number, geo: T, material: Material, top: boolean) {
    super(height, diameter, geo, material);
    if (!top) {
      //Using rotation instead of scale otherwise USDZ export isn't going to work
      this.mesh.rotation.x = Math.PI;
    }
    this.top = top;
  }

  public getHeight(): number {
    return this.height;
  }
}
