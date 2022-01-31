import { CoverType } from './CoverType';
import { FootType } from './FootType';
import { URLBehaelterData } from './URLBehaelterData';

export class BehaelterData {
  //each of the setters checks if a string is given for URLParameter stuff and transforms it into the proper value
  //----------
  private _zylinderHoehe: number;
  public get zylinderHoehe(): number {
    return this._zylinderHoehe;
  }
  public set zylinderHoehe(value: string | number) {
    this._zylinderHoehe = this.convertHelper(value);
  }
  //----------
  private _durchmesser: number;
  public get durchmesser(): number {
    return this._durchmesser;
  }
  public set durchmesser(value: number | string) {
    this._durchmesser = this.convertHelper(value);
  }
  //----------
  private _typTop: CoverType;
  public get typTop(): CoverType {
    return this._typTop;
  }
  public set typTop(value: CoverType | string) {
    this._typTop = this.convertHelper(value);
  }
  //----------
  private _typBot: CoverType;
  public get typBot(): CoverType {
    return this._typBot;
  }
  public set typBot(value: CoverType | string) {
    this._typBot = this.convertHelper(value);
  }
  //----------
  private _bodenfreiheit: number;
  public get bodenfreiheit(): number {
    return this._bodenfreiheit;
  }
  public set bodenfreiheit(value: number | string) {
    this._bodenfreiheit = this.convertHelper(value);
  }
  //----------
  private _winkelTop: number;
  public get winkelTop(): number {
    return this._winkelTop;
  }
  public set winkelTop(value: number | string) {
    this._winkelTop = this.convertHelper(value);
  }
  //----------
  private _winkelBot: number;
  public get winkelBot(): number {
    return this._winkelBot;
  }
  public set winkelBot(value: number | string) {
    this._winkelBot = this.convertHelper(value);
  }
  //----------
  private _fusstyp: FootType;
  public get fusstyp(): FootType {
    return this._fusstyp;
  }
  public set fusstyp(value: FootType | string) {
    this._fusstyp = this.convertHelper(value);
  }
  //----------
  private _stehend: boolean;
  public get stehend(): boolean {
    return this._stehend;
  }
  public set stehend(value: boolean | string) {
    if (value === 'false' || value === '0') {
      this._stehend = false;
      return;
    }
    this._stehend = Boolean(value);
  }

  constructor();
  constructor(data: URLBehaelterData);
  constructor(data: BehaelterData);
  constructor(data?: URLBehaelterData | BehaelterData) {
    if (!data) {
      //same values as the standard in the config
      this.zylinderHoehe = 4000;
      this.durchmesser = 2000;
      this.typTop = CoverType.Cone;
      this.typBot = CoverType.Cone;
      this.bodenfreiheit = 500;
      this.winkelBot = 15;
      this.winkelTop = 20;
      this.fusstyp = FootType.Standard;
      this.stehend = true;
    } else {
      if (data instanceof BehaelterData) {
        this.zylinderHoehe = data.zylinderHoehe;
        this.durchmesser = data.durchmesser;
        this.typTop = data.typTop;
        this.typBot = data.typBot;
        this.bodenfreiheit = data.bodenfreiheit;
        this.winkelBot = data.winkelBot;
        this.winkelTop = data.winkelTop;
        this.fusstyp = data.fusstyp;
        this.stehend = data.stehend;
      } else {
        this.zylinderHoehe = data.zh;
        this.durchmesser = data.dm;
        this.typTop = data.tt;
        this.typBot = data.tb;
        this.bodenfreiheit = data.bf;
        this.winkelBot = data.wb;
        this.winkelTop = data.wt;
        this.fusstyp = data.ft;
        this.stehend = data.st;
      }
    }
  }

  private convertHelper(value: number | string): number {
    return typeof value === 'number' ? value : parseInt(value);
  }

  /**
   * converts the BehaelterData into a 'stringified' version of itself
   * @returns {URLBehaelterData} URLBehaelterData object to return
   */
  public convertToURLData(): URLBehaelterData {
    const retVal: URLBehaelterData = {
      zh: this.zylinderHoehe.toString(),
      dm: this.durchmesser.toString(),
      tt: this.typTop.toString(),
      tb: this.typBot.toString(),
      bf: this.bodenfreiheit.toString(),
      wt: this.winkelTop.toString(),
      wb: this.winkelBot.toString(),
      ft: this.fusstyp.toString(),
      st: this.stehend.toString()
    };

    return retVal;
  }
}
