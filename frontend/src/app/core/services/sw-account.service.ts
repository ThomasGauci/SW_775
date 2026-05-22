import { Injectable, signal, computed } from '@angular/core';
import { SwAccountData, SwRune } from '../../models/sw-account.model';

@Injectable({ providedIn: 'root' })
export class SwAccountService {
  private readonly STORAGE_KEY = 'sw_account_v1';
  private readonly _data = signal<SwAccountData | null>(null);

  readonly data = this._data.asReadonly();
  readonly hasData = computed(() => this._data() !== null);
  readonly wizard = computed(() => this._data()?.wizard ?? null);
  readonly units = computed(() => this._data()?.units ?? []);
  readonly runes = computed(() => {
    const d = this._data();
    if (!d) return [];
    // Merge: standalone runes + runes equipped on units
    const equippedRunes: SwRune[] = d.units.flatMap(u => u.runes ?? []);
    return [...d.runes, ...equippedRunes];
  });
  readonly artifacts = computed(() => this._data()?.artifacts ?? []);

  constructor() {
    this._loadFromStorage();
  }

  private _loadFromStorage(): void {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (raw) this._data.set(JSON.parse(raw));
    } catch { /* ignore */ }
  }

  importFile(file: File): Promise<SwAccountData> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target!.result as string);
          const data = this._parse(json);
          this._data.set(data);
          // Store only the essential fields (not images) to stay under localStorage limit
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
          resolve(data);
        } catch (err: any) {
          reject(new Error(err?.message ?? 'Erreur de parsing'));
        }
      };
      reader.onerror = () => reject(new Error('Erreur de lecture du fichier'));
      reader.readAsText(file);
    });
  }

  private _parse(json: any): SwAccountData {
    if (!json.wizard_info || !json.unit_list) {
      throw new Error("Fichier invalide — vérifiez que c'est bien un export SW Exporter");
    }
    const wi = json.wizard_info;
    return {
      importedAt: new Date().toISOString(),
      wizard: {
        wizard_id: wi.wizard_id,
        wizard_name: wi.wizard_name,
        wizard_level: wi.wizard_level,
        wizard_mana: wi.wizard_mana,
        wizard_crystal: wi.wizard_crystal,
        wizard_last_login: wi.wizard_last_login,
      },
      units: (json.unit_list ?? []).map((u: any) => ({
        unit_id: u.unit_id,
        unit_master_id: u.unit_master_id,
        unit_level: u.unit_level,
        class: u.class,
        skills: u.skills ?? [],
        runes: (u.runes ?? []).map((r: any) => this._parseRune(r)),
        con: u.con,
        atk: u.atk,
        def: u.def,
        spd: u.spd,
        resist: u.resist,
        accuracy: u.accuracy,
        critical_rate: u.critical_rate,
        critical_damage: u.critical_damage,
      })),
      runes: (json.runes ?? []).map((r: any) => this._parseRune(r)),
      artifacts: (json.artifacts ?? []).map((a: any) => ({
        rid: a.rid,
        occupied_id: a.occupied_id,
        type: a.type,
        attribute: a.attribute,
        unit_style: a.unit_style,
        rank: a.rank,
        natural_rank: a.natural_rank,
        level: a.level,
        pri_effect: a.pri_effect,
        sec_effects: a.sec_effects ?? [],
        locked: a.locked ?? 0,
      })),
    };
  }

  private _parseRune(r: any): SwRune {
    return {
      rune_id: r.rune_id,
      occupied_id: r.occupied_id ?? 0,
      slot_no: r.slot_no,
      rank: r.rank,
      class: r.class,
      set_id: r.set_id,
      upgrade_curr: r.upgrade_curr,
      pri_eff: r.pri_eff,
      prefix_eff: r.prefix_eff ?? [0, 0],
      sec_eff: r.sec_eff ?? [],
      extra: r.extra ?? 0,
    };
  }

  clear(): void {
    this._data.set(null);
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
