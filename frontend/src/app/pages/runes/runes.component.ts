import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SwAccountService } from '../../core/services/sw-account.service';
import { MonsterService } from '../../core/services/monster.service';
import { SwRune } from '../../models/sw-account.model';
import { RUNE_SETS, STAT_NAMES, RUNE_RANK_NAMES, MAX_RUNE_STAT } from '../../core/constants/sw-constants';

type SortKey = 'slot' | 'set' | 'upgrade' | 'rank' | 'efficiency';

@Component({
  selector: 'app-runes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './runes.component.html',
  styleUrls: ['./runes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RunesComponent {
  readonly swAccountService = inject(SwAccountService);
  readonly monsterService = inject(MonsterService);

  filterSet = signal<number | 'all'>('all');
  filterSlot = signal<number | 'all'>('all');
  filterEquipped = signal<'all' | 'equipped' | 'unequipped'>('all');
  filterRank = signal<number | 'all'>('all');
  filterStat = signal<number | 'all'>('all');
  searchText = signal('');
  sortKey = signal<SortKey>('upgrade');
  sortDir = signal<1 | -1>(-1);

  readonly slots = [1, 2, 3, 4, 5, 6];
  readonly ranks = [5, 4, 3, 2, 1];
  readonly setIds = Object.keys(RUNE_SETS).map(Number).sort((a, b) => a - b);
  readonly statOptions = [1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12];

  readonly filteredRunes = computed<SwRune[]>(() => {
    const setF = this.filterSet();
    const slotF = this.filterSlot();
    const equippedF = this.filterEquipped();
    const rankF = this.filterRank();
    const statF = this.filterStat();
    const q = this.searchText().toLowerCase().trim();
    const key = this.sortKey();
    const dir = this.sortDir();

    let list = this.swAccountService.runes().filter(r => {
      if (setF !== 'all' && r.set_id !== setF) return false;
      if (slotF !== 'all' && r.slot_no !== slotF) return false;
      if (rankF !== 'all' && r.rank !== rankF) return false;
      if (equippedF === 'equipped' && r.occupied_id === 0) return false;
      if (equippedF === 'unequipped' && r.occupied_id !== 0) return false;
      if (q) {
        const setName = this.getSetName(r.set_id).toLowerCase();
        if (!setName.includes(q)) return false;
      }
      if (statF !== 'all') {
        const inMain = r.pri_eff[0] === statF;
        const inSubs = r.sec_eff.some(sub => sub[0] === statF);
        const inPrefix = r.prefix_eff[0] === statF;
        if (!inMain && !inSubs && !inPrefix) return false;
      }
      return true;
    });

    list = [...list].sort((a, b) => {
      let cmp = 0;
      if (key === 'slot') cmp = a.slot_no - b.slot_no;
      else if (key === 'set') cmp = (RUNE_SETS[a.set_id] ?? '').localeCompare(RUNE_SETS[b.set_id] ?? '');
      else if (key === 'upgrade') cmp = a.upgrade_curr - b.upgrade_curr;
      else if (key === 'rank') cmp = a.rank - b.rank;
      else if (key === 'efficiency') cmp = this.calcEfficiency(a) - this.calcEfficiency(b);
      return cmp * dir;
    });

    return list;
  });

  getSetName(setId: number): string {
    return RUNE_SETS[setId] ?? `Set ${setId}`;
  }

  getStatName(statId: number): string {
    return STAT_NAMES[statId] ?? `Stat${statId}`;
  }

  getStatDisplay(eff: [number, number]): string {
    if (!eff || eff[0] === 0) return '—';
    return `${this.getStatName(eff[0])} +${eff[1]}`;
  }

  getRankClass(rank: number): string {
    const map: Record<number, string> = {
      1: 'normal',
      2: 'magic',
      3: 'rare',
      4: 'hero',
      5: 'legend',
    };
    return map[rank] ?? '';
  }

  getRankName(rank: number): string {
    return RUNE_RANK_NAMES[rank] ?? `R${rank}`;
  }

  isAncient(rune: SwRune): boolean {
    return rune.extra === 1;
  }

  getEquippedOn(rune: SwRune): string {
    if (rune.occupied_id === 0) return 'Inventaire';
    const unit = this.swAccountService.units().find(u => u.unit_id === rune.occupied_id);
    if (!unit) return '?';
    const monster = this.monsterService.getById(unit.unit_master_id);
    return monster?.name ?? `#${unit.unit_master_id}`;
  }

  getUpgradeClass(upgrade: number): string {
    if (upgrade >= 15) return 'upgrade-max';
    if (upgrade >= 12) return 'upgrade-high';
    if (upgrade >= 9) return 'upgrade-mid';
    return 'upgrade-low';
  }

  getSlotClass(slot: number): string {
    return `slot-${slot}`;
  }

  toggleSort(key: SortKey): void {
    if (this.sortKey() === key) {
      this.sortDir.update(d => (d === 1 ? -1 : 1));
    } else {
      this.sortKey.set(key);
      this.sortDir.set(key === 'upgrade' || key === 'rank' || key === 'efficiency' ? -1 : 1);
    }
  }

  formatSecEff(eff: [number, number, number, number]): string {
    if (!eff || eff[0] === 0) return '';
    const statName = this.getStatName(eff[0]);
    const val = eff[1];
    const grind = eff[3];
    let str = `${statName} +${val}`;
    if (eff[2]) str = `[✦] ${str}`;
    if (grind > 0) str += ` (+${grind})`;
    return str;
  }

  calcEfficiency(rune: SwRune): number {
    let score = 0;
    for (const eff of rune.sec_eff) {
      if (!eff[0]) continue;
      const max = MAX_RUNE_STAT[eff[0]];
      if (!max) continue;
      score += (eff[1] + eff[3]) / max;
    }
    const hasPrefix = rune.prefix_eff[0] > 0;
    if (hasPrefix) {
      const max = MAX_RUNE_STAT[rune.prefix_eff[0]];
      if (max) score += rune.prefix_eff[1] / max;
    }
    const denom = hasPrefix ? 5 : 4;
    return Math.round(score / denom * 100);
  }

  getEfficiencyClass(eff: number): string {
    if (eff >= 100) return 'eff-perfect';
    if (eff >= 80) return 'eff-high';
    if (eff >= 60) return 'eff-mid';
    return 'eff-low';
  }
}
