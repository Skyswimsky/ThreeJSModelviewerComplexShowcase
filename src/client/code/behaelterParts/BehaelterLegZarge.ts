import { BoxGeometry, CylinderBufferGeometry, CylinderGeometry, Material, Mesh, Vector3 } from 'three';
import { BehaelterLeg } from './BehaelterLeg';
import { BehaelterPart } from './BehaelterPart';

export class BehaelterLegZarge extends BehaelterLeg<CylinderGeometry> {
  constructor(height: number, diameter: number, material: Material) {
    const radian = diameter / 2;
    const geo = new CylinderGeometry(radian, radian, height, 61, 1);
    super(height, diameter, geo, material);
  }

  //Zarge doesn't need to adjust its position other than height and Manager takes care of that
  public adjustLegPos(rotation: number): void {}
}
