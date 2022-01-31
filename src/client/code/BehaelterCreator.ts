//note to me: shape von top und bot muss auch beachtet werden/aufgenommen werden

import * as THREE from 'three';
import {
  BoxGeometry,
  BufferGeometry,
  CylinderGeometry,
  Group,
  Material,
  Mesh,
  Object3D,
  SphereGeometry,
  Vector3,
  Quaternion,
  Sphere,
  ConeGeometry,
  MeshStandardMaterial,
  TextureLoader
} from 'three';
import { CoverType } from './data/CoverType';
import { BehaelterBody } from './behaelterParts/BehaelterBody';
import { BehaelterDeckel } from './behaelterParts/BehaelterDeckel';
import { BehaelterLegManager } from './behaelterParts/BehaelterLegManager';
import { BehaelterDeckelCone } from './behaelterParts/BehaelterDeckelCone';
import { BehaelterDeckelSphere } from './behaelterParts/BehaelterDeckelSphere';
import { IBehaelterPart } from './Interfaces/IBehaelterPart';
import { BehaelterData } from './data/BehaelterData';

/**
 * Class to create a roth behälter and adjust various geometrical properties as the components are
 * being warped and changed
 */
class BehaelterCreator {
  // #region variables
  private behaelterBody: BehaelterBody;
  private behaelterBot: BehaelterDeckel<SphereGeometry | ConeGeometry>;
  private behaelterTop: BehaelterDeckel<SphereGeometry | ConeGeometry>;
  private behaelterLegs: BehaelterLegManager;
  private material: MeshStandardMaterial;

  private behaelter: Group;
  private behaelterParts: IBehaelterPart<BufferGeometry>[];

  // #endregion

  // #region constructors
  /**
   * Constructor setting up a container with basic dimensions
   */
  constructor(data: BehaelterData) {
    this.material = new THREE.MeshStandardMaterial({
      color: 0x8e8e8e,
      metalness: 0.9,
      roughness: 0.4
    });
    this.behaelter = new Group();

    this.constructEntireBehaelter(data);

    //scales to mm
    // this.behaelter.scale.set(0.001, 0.001, 0.001);
  }

  // #endregion

  // #region public methods
  public createBehaelter(data: BehaelterData) {
    this.constructEntireBehaelter(data);
  }

  public getBehaelter(): Group {
    return this.behaelter;
  }

  // #endregion
  // #region private methods

  /**
   * Adjust height positions of the components
   * @param  {number} heightToAdjustTo
   */
  private adjustHeightPositions(data: BehaelterData): void {
    this.behaelterParts.forEach((part) => {
      part.adjustHeightPositions(data);
    });

    //rotate if not stehend
    if (!data.stehend) {
      this.behaelter.rotation.z = Math.PI / -2;
    } else {
      this.behaelter.rotation.z = 0;
    }
  }

  // #endregion

  // #region constructor-helpers

  private constructEntireBehaelter(data: BehaelterData) {
    this.behaelter.clear();
    this.createBehaelterParts(this.material, data);
    this.addBehaelterParts();
    this.adjustHeightPositions(data);
  }
  /**
   * add parts to the group
   */
  private addBehaelterParts() {
    this.behaelter.add(
      this.behaelterBody.mesh,
      this.behaelterBot.mesh,
      this.behaelterTop.mesh,
      ...this.behaelterLegs.getLegMeshCollection()
    );

    this.behaelterParts = [this.behaelterBody, this.behaelterBot, this.behaelterTop, this.behaelterLegs];
  }

  /**
   * Create all relevant parts of the Behälter based on provided data and material
   * @param {MeshStandardMaterial} material
   * @param {BehaelterData} data
   */
  private createBehaelterParts(material: THREE.MeshStandardMaterial, data: BehaelterData) {
    this.behaelterBody = new BehaelterBody(data.zylinderHoehe, data.durchmesser, material);
    this.behaelterTop = this.CoverHelper(data.durchmesser, data.typTop, material, true, data.winkelTop);
    this.behaelterBot = this.CoverHelper(data.durchmesser, data.typBot, material, false, data.winkelBot);

    const dataClone: BehaelterData = new BehaelterData(data);

    //we add the height of the bottom cover part if it is relevant to the height of the legs
    if (data.stehend && data.typBot != CoverType.None) {
      dataClone.bodenfreiheit = dataClone.bodenfreiheit + this.behaelterBot.getHeight();
    }

    this.behaelterLegs = new BehaelterLegManager(dataClone, material);
  }
  /**
   * Helper for creating the correct cover type
   * @param diameter
   * @param deckelTyp
   * @param material
   * @param top
   * @param winkel
   * @returns
   */
  private CoverHelper(
    diameter: number,
    deckelTyp: CoverType,
    material: Material,
    top: boolean,
    winkel: number | undefined
  ): BehaelterDeckel<SphereGeometry | ConeGeometry> {
    let ret: BehaelterDeckel<SphereGeometry | ConeGeometry>;
    switch (deckelTyp) {
      case CoverType.Cone:
        if (winkel == undefined) {
          throw new Error('Kein Winkel angegeben!');
        }
        ret = new BehaelterDeckelCone(winkel, diameter, material, top);
        break;
      case CoverType.Round:
        ret = new BehaelterDeckelSphere(diameter, material, top);
        break;
      case CoverType.None:
        //just a dummy object with visibility set to false to not make any issues
        ret = new BehaelterDeckelSphere(1, material, top);
        ret.mesh.visible = false;
        break;
    }

    return ret;
  }

  // #endregion
}

export { BehaelterCreator };
