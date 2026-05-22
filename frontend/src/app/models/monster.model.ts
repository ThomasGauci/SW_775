export type Element = 'f' | 'w' | 'n' | 'l' | 'd';

export interface Monster {
  id: number;
  name: string;
  elem: Element;
  nat: number; // 2-5
  img?: string; // base64 data URL
}

export const ELEMENT_LABELS: Record<Element, { emoji: string; label: string }> = {
  f: { emoji: '🔥', label: 'Feu' },
  w: { emoji: '💧', label: 'Eau' },
  n: { emoji: '🌪️', label: 'Vent' },
  l: { emoji: '☀️', label: 'Lumière' },
  d: { emoji: '🌑', label: 'Ténèbres' }
};
