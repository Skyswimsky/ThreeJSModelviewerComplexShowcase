import { BoxGeometry, CylinderGeometry, Material, Mesh, MeshStandardMaterial } from 'three';
import { BehaelterData } from '../data/BehaelterData';
import { FootType } from '../data/FootType';
import { IBehaelterPart } from '../Interfaces/IBehaelterPart';
import { BehaelterLeg } from './BehaelterLeg';
import { BehaelterLegSideways } from './BehaelterLegSideways';
import { BehaelterLegStandard } from './BehaelterLegStandard';
import { BehaelterLegZarge } from './BehaelterLegZarge';

export class BehaelterLegManager implements IBehaelterPart<BoxGeometry> {
  private leg1: BehaelterLegStandard;
  private leg2: BehaelterLegStandard;
  private leg3: BehaelterLegStandard;
  private legSpecial: BehaelterLegZarge;
  private legGroup: BehaelterLeg<CylinderGeometry | BoxGeometry>[] = [];

  constructor(data: BehaelterData, material: Material) {
    //helper to make legs
    const legConstructor = () => {
      const downScaledDiameter: number = data.durchmesser * 0.1;
      return new BehaelterLegStandard(data.bodenfreiheit, downScaledDiameter, material);
    };

    //if the behälter is going to be sideways instead, we only construct sideway legs
    //bit of a dirty implementation TODO: implement more proper
    if (!data.stehend) {
      //constructor helper
      const sideLegConstructor = () => {
        return new BehaelterLegSideways(data.bodenfreiheit, data.durchmesser, material);
      };

      //create only two sideway legs and adjust them...
      this.legGroup = [sideLegConstructor(), sideLegConstructor()];
      this.adjustSidewayLegs(data.zylinderHoehe, data.durchmesser);

      //exit the method since we don't need the other stuff
      return;
    }

    //transparent material for Zarge, depending if customer wishes for.
    //TODO: implement more proper
    const material2 = new MeshStandardMaterial({
      color: 0x8e8e8e,
      metalness: 0.9,
      roughness: 0.4,
      transparent: true,
      opacity: 0.5
    });

    switch (data.fusstyp) {
      case FootType.Keine:
        break;
      case FootType.Standard:
        this.legGroup = [legConstructor(), legConstructor(), legConstructor()];
        this.adjustLegs();
        break;
      case FootType.Zarge:
        this.legGroup = [new BehaelterLegZarge(data.bodenfreiheit, data.durchmesser, material2)];
        break;
    }
  }

  /**
   * Get meshes of the individual legs
   */
  public *getLegMeshCollection() {
    let length = this.legGroup.length;
    for (let i = 0; i < length; i++) {
      yield this.legGroup[i].mesh;
    }
  }

  /**
   * calls individual methods on the objects
   * @param data
   */
  public adjustHeightPositions(data: BehaelterData): void {
    this.legGroup.forEach((leg) => {
      leg.adjustHeightPositions(data);
    });
  }

  /**
   * Adjust position of the legs to stick to the sides with proper distance between
   */
  private adjustLegs(): void {
    //helper variable
    const tau = Math.PI * 2;
    const length = this.legGroup.length;
    for (let i = 0; i < this.legGroup.length; i++) {
      const leg = this.legGroup[i];

      //with 3 legs, the rotation is basically 0/3, 1/3 and 2/3
      leg.adjustLegPos((i / length) * tau);
    }
  }

  /**
   * adjust the sideway legs properly
   * @param height
   * @param durchmesser
   */
  private adjustSidewayLegs(height: number, durchmesser: number): void {
    //one 'step' is 1/10 of the total height
    const heightSteps = height / 10;
    const leg1 = this.legGroup[0];
    const leg2 = this.legGroup[1];

    //Basically how close/far away from the ending of the both sides the legs should be
    const offset = 3.5;

    this.legGroup[0].mesh.position.y = heightSteps * offset;
    this.legGroup[1].mesh.position.y = heightSteps * -offset;

    //place the leg starting in the "middle" of the container
    leg1.mesh.position.x = durchmesser / 2;
    leg2.mesh.position.x = durchmesser / 2;
  }
}
