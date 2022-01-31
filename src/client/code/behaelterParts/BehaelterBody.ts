import { CylinderBufferGeometry, CylinderGeometry, Material, Mesh } from 'three';
import { BehaelterData } from '../data/BehaelterData';
import { BehaelterPart } from './BehaelterPart';

export class BehaelterBody extends BehaelterPart<CylinderGeometry> {
  constructor(height: number, diameter: number, material: Material) {
    const radian = diameter / 2;
    const geo = new CylinderGeometry(radian, radian, height, 64, 1);
    super(height, diameter, geo, material);
  }

  public adjustHeightPositions(data: BehaelterData): void {}
}
