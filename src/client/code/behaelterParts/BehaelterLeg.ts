import {
  BoxGeometry,
  ConeGeometry,
  CylinderBufferGeometry,
  CylinderGeometry,
  Material,
  Mesh,
  SphereGeometry,
  Vector3
} from 'three';
import { BehaelterData } from '../data/BehaelterData';
import { BehaelterPart } from './BehaelterPart';

export abstract class BehaelterLeg<T extends BoxGeometry | CylinderGeometry> extends BehaelterPart<T> {
  constructor(height: number, diameter: number, geo: T, material: Material) {
    super(height, diameter, geo, material);
  }

  public adjustHeightPositions(data: BehaelterData): void {
    const offset = data.zylinderHoehe / 2;
    const legOffset = this.height / 2;
    this.mesh.position.y = -offset - legOffset;
  }

  /**
   * Adjust position of legs
   * @param rotation rotation to work with
   */
  public abstract adjustLegPos(rotation: number): void;
}
