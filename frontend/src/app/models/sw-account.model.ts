export interface SwWizardInfo {
  wizard_id: number;
  wizard_name: string;
  wizard_level: number;
  wizard_mana: number;
  wizard_crystal: number;
  wizard_last_login: string;
}

export interface SwUnit {
  unit_id: number;
  unit_master_id: number;
  unit_level: number;
  class: number;
  skills: [number, number][];
  runes: SwRune[];
  con: number;
  atk: number;
  def: number;
  spd: number;
  resist: number;
  accuracy: number;
  critical_rate: number;
  critical_damage: number;
}

export interface SwRune {
  rune_id: number;
  occupied_id: number;
  slot_no: number;
  rank: number;
  class: number;
  set_id: number;
  upgrade_curr: number;
  pri_eff: [number, number];
  prefix_eff: [number, number];
  sec_eff: [number, number, number, number][];
  extra: number;
}

export interface SwArtifact {
  rid: number;
  occupied_id: number;
  type: number;
  attribute: number;
  unit_style: number;
  rank: number;
  natural_rank: number;
  level: number;
  pri_effect: number[];
  sec_effects: number[][];
  locked: number;
}

export interface SwAccountData {
  importedAt: string;
  wizard: SwWizardInfo;
  units: SwUnit[];
  runes: SwRune[];
  artifacts: SwArtifact[];
}
