export type Element = 'f' | 'w' | 'n' | 'l' | 'd';

export interface Monster {
  id: number;
  name: string;
  elem: Element;
  nat: number; // 2-5
  img?: string; // base64 data URL
}

export const ELEMENT_LABELS: Record<Element, { label: string; cssClass: string }> = {
  f: { label: 'Feu',      cssClass: 'elem-f' },
  w: { label: 'Eau',      cssClass: 'elem-w' },
  n: { label: 'Vent',     cssClass: 'elem-n' },
  l: { label: 'Lumière',  cssClass: 'elem-l' },
  d: { label: 'Ténèbres', cssClass: 'elem-d' },
};
