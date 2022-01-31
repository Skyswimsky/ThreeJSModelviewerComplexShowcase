import { BufferGeometry, Material, Mesh } from 'three';
import { BehaelterData } from '../data/BehaelterData';
import { IBehaelterPart } from '../Interfaces/IBehaelterPart';

export abstract class BehaelterPart<T extends BufferGeometry> implements IBehaelterPart<T> {
  private _mesh: Mesh<T>;
  public get mesh(): Mesh<T> {
    return this._mesh;
  }
  protected set mesh(value: Mesh<T>) {
    this._mesh = value;
  }
  protected height: number;
  protected diameter: number;

  constructor(height: number, diameter: number, geo: T, material: Material) {
    this.mesh = new Mesh<T>(geo, material);
    this.height = height;
    this.diameter = diameter;
  }
  /**
   * Calculate heigh relative to rest
   * @param data data to base calculations on
   */
  abstract adjustHeightPositions(data: BehaelterData): void;
}
