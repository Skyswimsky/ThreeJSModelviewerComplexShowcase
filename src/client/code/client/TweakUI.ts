import { Pane, InputBindingApi, ButtonApi, FolderApi } from 'tweakpane';
import { BehaelterData } from '../data/BehaelterData';
import { CoverType } from '../data/CoverType';
import { FootType } from '../data/FootType';
import * as qrcode from 'qrcode';
import * as EssentialsPlugin from '@tweakpane/plugin-essentials';

export class TweakUI {
  private data: BehaelterData;

  constructor(
    data: BehaelterData,
    callbackContainer: () => void,
    callbackExport: () => void,
    parameterExpand: boolean
  ) {
    this.data = data;
    this.setupGui(callbackContainer, callbackExport, parameterExpand);
    this.adjustTweakPane();
  }

  private setupGui(callBackContainer: () => void, callbackExport: () => void, parameterExpand: boolean) {
    const data = this.data;
    const createContainer = callBackContainer;
    const coverOptions = {
      Flachboden: CoverType.None,
      Kegelboden: CoverType.Cone,
      'Gewölbter Boden': CoverType.Round
    };
    const footVertical = {
      Standard: FootType.Standard,
      Zarge: FootType.Zarge,
      Keine: FootType.Keine
    };

    const footHorizontal = [{ text: 'Sattel', value: 0 }];

    const pane = new Pane({
      container: document.getElementById('gui-panel')!
    });
    pane.registerPlugin(EssentialsPlugin);

    const settingsFolder = pane.addFolder({ title: 'Behälter-3D-Konfiguration', expanded: parameterExpand });
    const winkelCheck = (binding: InputBindingApi<unknown, number | undefined>, currentVal: CoverType) => {
      if (currentVal == CoverType.Cone) {
        binding.hidden = false;
      } else {
        binding.hidden = true;
      }
    };

    const liegendCheck = () => {
      if (data.stehend) {
        dummyFoot.hidden = true;
        relevantFoot.hidden = false;
      } else {
        dummyFoot.hidden = false;
        relevantFoot.hidden = true;
      }
    };

    const legCheck = settingsFolder
      .addInput(data, 'zylinderHoehe', {
        label: 'Zylindrische Höhe',
        step: 1
      })
      .on('change', () => {
        createContainer();
      });
    settingsFolder.addInput(data, 'durchmesser', { label: 'Durchmesser', step: 1 }).on('change', () => {
      createContainer();
    });
    settingsFolder.addInput(data, 'typTop', { options: coverOptions, label: 'Boden oben' }).on('change', (ev) => {
      createContainer();
      winkelCheck(winkelTop, ev.value);
    });
    const winkelTop = settingsFolder.addInput(data, 'winkelTop', { label: 'Kegelwinkel', step: 1 }).on('change', () => {
      createContainer();
    });
    settingsFolder.addInput(data, 'typBot', { options: coverOptions, label: 'Boden unten' }).on('change', (ev) => {
      createContainer();
      winkelCheck(winkelBot, ev.value);
    });
    const winkelBot = settingsFolder.addInput(data, 'winkelBot', { label: 'Kegelwinkel', step: 1 }).on('change', () => {
      createContainer();
    });
    winkelCheck(winkelTop, data.typTop);
    winkelCheck(winkelBot, data.typBot);
    settingsFolder.addInput(data, 'bodenfreiheit', { label: 'Bodenfreiheit', step: 1 }).on('change', () => {
      createContainer();
    });
    const relevantFoot = settingsFolder
      .addInput(data, 'fusstyp', { options: footVertical, label: 'Fuß' })
      .on('change', () => {
        createContainer();
      });

    //If Behälter is liegend, we show this input instead
    const dummyFoot = settingsFolder.addBlade({ view: 'list', label: 'Fuß', options: footHorizontal, value: 0 });
    dummyFoot.disabled = true;

    const ausrichtung = {
      Ausrichtung: data.stehend ? 0 : 1
    };

    settingsFolder
      .addInput(ausrichtung, 'Ausrichtung', {
        view: 'radiogrid',
        groupName: 'Ausrichtung',
        size: [2, 1],
        cells: (x: number) => ({
          title: x === 0 ? 'Stehend' : 'Liegend',
          value: x
        })
      })
      .on('change', (ev) => {
        this.blurEl(ev.value);
        data.stehend = ev.value === 0 ? true : false;
        createContainer();
        liegendCheck();
      });

    const elements = this.htmlHelper('tp-radv_b');
    elements[ausrichtung.Ausrichtung].click();
    this.blurEl(ausrichtung.Ausrichtung);
    liegendCheck();

    pane.addButton({ title: 'Start' }).on('click', () => {
      callbackExport();
    });
  }

  //some hacky edits to the TweakPane layout to make it more mobile friendly
  private adjustTweakPane() {
    const htmlHelper = this.htmlHelper;

    //make input fields numbers
    let elements: HTMLCollectionOf<HTMLElement> = htmlHelper('tp-txtv_i');
    Array.from(elements).forEach((el) => {
      el.setAttribute('type', 'text');
      // el.setAttribute('type', 'number');
      el.setAttribute('inputmode', 'decimal');
    });

    //remove the drag&drop increase/decrease element
    elements = htmlHelper('tp-txtv_k');
    Array.from(elements).forEach((el) => {
      el.remove();
    });

    //set font size
    elements = htmlHelper('tp-rotv');
    Array.from(elements).forEach((el) => {
      el.style.fontSize = '12px';
    });

    let nodeEl = document.querySelectorAll('.tp-txtv.tp-txtv-num .tp-txtv_i') as NodeListOf<HTMLInputElement>;
    nodeEl.forEach((el) => {
      el.style.textAlign = 'left';
      let x = el.value;

      //'select' text when clicked in a input field
      el.addEventListener('focus', (e) => {
        el.select();
      });

      //make the copy/paste/cut context menu on mobile not appear
      el.addEventListener('contextmenu', (e) => {
        e.preventDefault();
      });

      //if no value is provided, go back to the value from before
      el.addEventListener('focusout', () => {
        if (el.value == '') el.value = x;
      });
    });

    //turns selection boxes white
    elements = this.htmlHelper('tp-lstv_s');
    Array.from(elements).forEach((el) => {
      el.style.backgroundColor = 'white';
    });

    //style title
    elements = this.htmlHelper('tp-fldv_t');
    let el = elements[0];
    el.style.backgroundColor = '#ececec';
    el.style.color = 'black';
    el.style.fontSize = '16px';
    el.style.textAlign = 'center';
    const arText = document.getElementById('ar-warning');

    //append warning text
    el = this.htmlHelper('tp-brkv')[0];
    if (arText) el.insertBefore(arText, el.childNodes[1]);
  }
  private htmlHelper(className: string): HTMLCollectionOf<HTMLElement> {
    return document.getElementsByClassName(className) as HTMLCollectionOf<HTMLElement>;
  }

  private blurEl(el: number) {
    this.htmlHelper('tp-radv')[el].blur();
    this.htmlHelper('tp-radv_l')[el].blur();
    this.htmlHelper('tp-radv_i')[el].blur();
    this.htmlHelper('tp-radv_b')[el].blur();
    this.htmlHelper('tp-radv_t')[el].blur();
  }
}
