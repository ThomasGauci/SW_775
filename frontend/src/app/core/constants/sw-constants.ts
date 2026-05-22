export const RUNE_SETS: Record<number, string> = {
  1: 'Énergie',
  2: 'Garde',
  3: 'Rapide',
  4: 'Lame',
  5: 'Rage',
  6: 'Focus',
  7: 'Endurance',
  8: 'Fatal',
  10: 'Désespoir',
  11: 'Vampire',
  13: 'Violent',
  14: 'Némésis',
  15: 'Volonté',
  16: 'Bouclier',
  17: 'Vengeance',
  18: 'Destruction',
  19: 'Combat',
  20: 'Détermination',
  21: 'Amélioration',
  22: 'Précision',
  23: 'Tolérance',
  24: 'Intangible',
  25: 'Sceau',
};

export const STAT_NAMES: Record<number, string> = {
  1: 'HP',
  2: 'HP%',
  3: 'ATK',
  4: 'ATK%',
  5: 'DEF',
  6: 'DEF%',
  8: 'VIT',
  9: 'TC%',
  10: 'DTC%',
  11: 'RES%',
  12: 'PREC%',
};

export const RUNE_RANK_NAMES: Record<number, string> = {
  1: 'Normal',
  2: 'Magique',
  3: 'Rare',
  4: 'Héros',
  5: 'Légendaire',
};

export const ARTIFACT_ATTRIBUTES: Record<number, string> = {
  0: 'Tous',
  1: 'Feu',
  2: 'Eau',
  3: 'Vent',
  4: 'Lumière',
  5: 'Ténèbres',
  98: 'Spécial',
};

export const ARTIFACT_STYLES: Record<number, string> = {
  0: 'Tous',
  1: 'Attaque',
  2: 'Défense',
  3: 'Support',
  4: 'HP',
  98: 'Spécial',
};

export const ARTIFACT_PRI_EFFECTS: Record<number, string> = {
  100: 'HP',
  101: 'ATK',
  102: 'DEF',
};

export const ARTIFACT_SEC_EFFECTS: Record<number, string> = {
  200: 'DMG reçu -% si HP > 50%',
  201: 'DMG reçu -% si HP < 50%',
  202: 'DMG Comp. 1 +%',
  204: 'DMG Comp. 2 +%',
  205: 'VIT +% si HP > 50%',
  206: 'VIT +% si HP < 50%',
  208: 'DMG additionnel (ATK)',
  209: 'Récupération +%',
  210: 'DMG cible unique +%',
  214: 'DMG DoT +%',
  215: 'DMG Crit élément +%',
  216: 'DMG vs Feu +%',
  217: 'DMG vs Eau +%',
  218: 'DMG vs Vent +%',
  219: 'DMG vs Lumière +%',
  220: 'DMG vs Ténèbres +%',
  221: 'CD Comp. 2 -1 tour',
  222: 'CD Comp. 3 -1 tour',
  223: 'Barre ATK +% (HP plein)',
  224: 'DoT 1 tour (Comp. 1)',
  225: 'Soin allié HP bas +%',
  300: 'DMG reçu +% (multi-cibles)',
  301: 'DMG reçu +%',
  302: 'DMG Comp. 1 reçu +%',
  303: 'DMG Comp. 2 reçu +%',
  304: 'DMG Comp. 3 reçu +%',
  305: 'DMG crit reçu +%',
  306: 'DMG reçu éléments +%',
  400: 'HP max +%',
  401: 'DEF +%',
  402: 'ATK +%',
  403: 'VIT +',
  404: 'TC +%',
  405: 'DTC +%',
  406: 'RES +%',
  407: 'PREC +%',
  408: 'Soins reçus +%',
  409: 'Dégâts compétences +%',
  410: 'DoT +%',
  411: 'Barre ATK +%',
};

export const RUNE_SET_PIECES: Record<number, number> = {
  1: 2,
  2: 2,
  3: 4,
  4: 2,
  5: 4,
  6: 2,
  7: 2,
  8: 4,
  10: 4,
  11: 4,
  13: 4,
  14: 2,
  15: 2,
  16: 2,
  17: 2,
  18: 2,
  19: 2,
  20: 2,
  21: 2,
  22: 2,
  23: 2,
  24: 2,
  25: 2,
};

// Max sub-stat values for a +15 Legend rune (used in efficiency formula)
export const MAX_RUNE_STAT: Record<number, number> = {
  1: 1875, 2: 63, 3: 100, 4: 63, 5: 100, 6: 63,
  8: 42, 9: 28, 10: 63, 11: 63, 12: 63,
};

// Max values for artifact secondary effects (community-sourced)
export const MAX_ARTIFACT_SEC: Record<number, number> = {
  200: 8, 201: 8, 202: 12, 204: 12, 205: 10, 206: 10,
  208: 10, 209: 8, 210: 12, 214: 8, 215: 8,
  216: 15, 217: 15, 218: 15, 219: 15, 220: 15,
  221: 1, 222: 1, 223: 15, 224: 1, 225: 8,
  300: 8, 301: 8, 302: 12, 303: 12, 304: 12, 305: 8, 306: 15,
  400: 8, 401: 8, 402: 8, 403: 8, 404: 8, 405: 10,
  406: 8, 407: 8, 408: 10, 409: 10, 410: 8, 411: 8,
};
