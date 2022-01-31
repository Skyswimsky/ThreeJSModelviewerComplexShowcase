import { BoxGeometry, CylinderBufferGeometry, CylinderGeometry, Material, Mesh, Vector3 } from 'three';
import { BehaelterLeg } from './BehaelterLeg';
import { BehaelterPart } from './BehaelterPart';

export class BehaelterLegStandard extends BehaelterLeg<CylinderGeometry> {
  constructor(height: number, diameter: number, material: Material) {
    const geo = new CylinderGeometry(diameter / 2, diameter / 2, height, 64, 1);
    super(height, diameter, geo, material);
  }

  public adjustLegPos(rotation: number): void {
    //Create a smaller circle to align to to make legs not 'stick out'
    const offset = this.diameter * 5 - this.diameter * 0.5;

    //Rotate the 'position' of the leg to find its proper position
    const x = Math.sin(rotation) * offset;
    const z = Math.cos(rotation) * offset;
    this.mesh.position.x = x;
    this.mesh.position.z = z;
    this.mesh.rotation.y = rotation;
  }
}
