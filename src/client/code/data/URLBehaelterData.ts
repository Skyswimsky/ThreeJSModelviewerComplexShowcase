//parameters to take in from the url
export type URLBehaelterData = {
  zh: string; //zylinderhöhe
  dm: string; //durchmesser
  tt: string; //toptyp(deckel oben)
  tb: string; //bodetyp(deckel unten)
  bf: string; //bodenfreiheit
  wt: string; //winkel top
  wb: string; //winkel bot
  ft: string; //fußtyp
  st: string; //stehend
};

//fußtyp und deckel oben und unten sind enums die von 0 bis X gehen und dabei die entsprechende nummer entgegen nehmen
