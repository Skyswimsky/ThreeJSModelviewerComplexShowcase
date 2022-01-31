import { ConeBufferGeometry, ConeGeometry, CylinderBufferGeometry, CylinderGeometry, Material, Mesh } from 'three';
import { BehaelterData } from '../data/BehaelterData';
import { BehaelterDeckel } from './BehaelterDeckel';
import { BehaelterPart } from './BehaelterPart';

export class BehaelterDeckelCone extends BehaelterDeckel<ConeGeometry> {
  constructor(winkel: number, diameter: number, material: Material, top: boolean) {
    const radius = diameter / 2;
    const height = Math.tan((winkel * Math.PI) / 180) * radius;
    const geo = new ConeGeometry(radius, height, 64, 1, true);
    super(height, diameter, geo, material, top);
  }

  public adjustHeightPositions(data: BehaelterData): void {
    //since we want to see everything of the cone, we need to add its own height to the offset as the center is in the middle
    let offset = (data.zylinderHoehe + this.height) / 2;
    if (!this.top) offset *= -1;
    this.mesh.position.y = offset;
  }

  public getHeight() {
    return this.height;
  }
}
