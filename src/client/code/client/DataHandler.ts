import { Group } from 'three';
import { BehaelterCreator } from '../BehaelterCreator';
import { BehaelterData } from '../data/BehaelterData';
import { URLBehaelterData } from '../data/URLBehaelterData';

/**
 * Takes care of manipulating and communicating the data between object and client
 */
export class DataHandler {
  private behaelterCreator: BehaelterCreator;
  private _data: BehaelterData;
  public get data(): BehaelterData {
    return this._data;
  }
  public set data(value: BehaelterData) {
    this._data = value;
    this.behaelterCreator = new BehaelterCreator(this.copyData());
  }

  private _object3Dbehaelter: Group;
  public get object3Dbehaelter(): Group {
    return this._object3Dbehaelter;
  }
  private set object3Dbehaelter(value: Group) {
    this._object3Dbehaelter = value;
  }

  constructor() {
    this.data = this.getInitData();
    this.behaelterCreator = new BehaelterCreator(this.copyData());
    this.object3Dbehaelter = this.behaelterCreator.getBehaelter();
  }

  /**
   * since the client wants things to be shown in mm, we divide the data and return a 'downscaled' copy
   * @returns
   */
  private copyData(): BehaelterData {
    const copyData = new BehaelterData(this.data);
    copyData.zylinderHoehe = copyData.zylinderHoehe / 1000;
    copyData.durchmesser = copyData.durchmesser / 1000;
    copyData.bodenfreiheit = copyData.bodenfreiheit / 1000;
    return copyData;
  }

  public createContainer() {
    window.history.replaceState(null, '', this.getParams());
    this.behaelterCreator.createBehaelter(this.copyData());
  }

  private getInitData() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let data: BehaelterData;

    const arr: any = {};
    urlParams.forEach((v, k) => {
      arr[k] = v;
    });

    //try to read data from stringparams, if not possible create a container with standard params
    if (this.isUrlBehaelterDataValid(arr as URLBehaelterData)) {
      data = new BehaelterData(arr);
    } else {
      data = new BehaelterData();
    }

    return data;
  }

  //check if the given object contains all the keys, if not returns false
  private isUrlBehaelterDataValid(data: URLBehaelterData): boolean {
    const keys: (keyof URLBehaelterData)[] = ['zh', 'dm', 'tt', 'tb', 'bf', 'wt', 'wb', 'ft', 'st'];

    for (const key of keys) {
      if (data[key] == null) {
        switch (key) {
          case 'bf':
            data['bf'] = '0';
            break;
          case 'wt':
            const tt = data['tt'];
            if (tt == null || tt === '1') return false;
          case 'wb':
            const tb = data['tb'];
            if (tb == null || tb === '1') return false;
          default:
            return false;
        }
      }
    }

    return true;
  }

  private getParams(): string {
    const params = new URLSearchParams(this.data.convertToURLData()).toString();
    return '?' + params;
  }
}
