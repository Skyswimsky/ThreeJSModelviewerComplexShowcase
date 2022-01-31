import { BufferGeometry } from 'three';
import { BehaelterData } from '../data/BehaelterData';

/**
 * Interface for Behaelter Parts
 */
//Exists mainly because LegManager doesn't inherit from BehaelterPart
export interface IBehaelterPart<T extends BufferGeometry> {
  adjustHeightPositions(data: BehaelterData): void;
}
