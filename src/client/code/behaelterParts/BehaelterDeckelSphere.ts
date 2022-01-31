import { ConeGeometry, CylinderBufferGeometry, CylinderGeometry, Material, Mesh, Sphere, SphereGeometry } from 'three';
import { BehaelterData } from '../data/BehaelterData';
import { BehaelterDeckel } from './BehaelterDeckel';

export class BehaelterDeckelSphere extends BehaelterDeckel<SphereGeometry> {
  constructor(diameter: number, material: Material, top: boolean) {
    //we divide it by 4 instead of 2 since we want more of an ellipsis than a circle with a 'height' the a quarter of the diameter.
    const radius = diameter / 4;
    //last few arguments are for only rendering half of the sphere
    const geo = new SphereGeometry(radius, 64, 32, 0, Math.PI * 2, 0, 0.5 * Math.PI);
    super(radius, diameter, geo, material, top);

    //scaling the 'sides' to fit the diameter again while keeping height small
    this.mesh.scale.x = 2;
    this.mesh.scale.z = 2;
  }

  public adjustHeightPositions(data: BehaelterData): void {
    //since it is a sphere and we only want to see half of it, don't need to add itself to the offset
    const offset = this.top ? data.zylinderHoehe / 2 : data.zylinderHoehe / -2;
    this.mesh.position.y = offset;
  }
}
