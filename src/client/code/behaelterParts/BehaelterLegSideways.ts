import { BoxGeometry, CylinderBufferGeometry, CylinderGeometry, Material, Mesh, Vector3 } from 'three';
import { BehaelterData } from '../data/BehaelterData';
import { BehaelterLeg } from './BehaelterLeg';
import { BehaelterPart } from './BehaelterPart';

export class BehaelterLegSideways extends BehaelterLeg<BoxGeometry> {
  constructor(height: number, diameter: number, material: Material) {
    //Height and diameter are a tad different here because we stick the legs to the 'side' of the behälter (before rotating the behälter)
    const geo = new BoxGeometry(height + diameter / 2, 0.2, diameter);
    super(height, diameter, geo, material);
  }

  //Pretty sure this isn't even called here and can be emptied. Leaving it here for now since I can't test
  public adjustLegPos(rotation: number): void {
    const offset = this.diameter * 5 - this.diameter * 0.5;
    const x = Math.sin(rotation) * offset;
    const z = Math.cos(rotation) * offset;
    this.mesh.position.x = x;
    this.mesh.position.z = z;
    this.mesh.rotation.y = rotation;
  }

  //Height here is calculated in a way as if the container was already rotated side-ways, hence the x-axis is the up/down
  public adjustHeightPositions(data: BehaelterData): void {
    const combinedHeight = data.durchmesser / 2 + data.bodenfreiheit;
    this.mesh.position.x = combinedHeight / 2;
  }
}
