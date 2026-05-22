import { Component, ChangeDetectionStrategy, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SwAccountService } from '../../core/services/sw-account.service';
import { MonsterService } from '../../core/services/monster.service';
import { SwUnit } from '../../models/sw-account.model';
import { Monster, Element, ELEMENT_LABELS } from '../../models/monster.model';
import { SafeUrlPipe } from '../../core/pipes/safe-url.pipe';

type SortKey = 'name' | 'level' | 'nat' | 'stars';
type ElemFilter = 'all' | Element;

interface UnitWithMonster {
  unit: SwUnit;
  monster: Monster | null;
  name: string;
  elem: Element | null;
  nat: number;
  awakened: boolean;
  skillsSummary: string;
  skillsMaxed: boolean;
}

@Component({
  selector: 'app-monsters',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, SafeUrlPipe],
  templateUrl: './monsters.component.html',
  styleUrls: ['./monsters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonstersComponent implements OnInit {
  readonly swAccountService = inject(SwAccountService);
  readonly monsterService = inject(MonsterService);

  searchQuery = signal('');
  filterElem = signal<ElemFilter>('all');
  sortKey = signal<SortKey>('name');
  sortDir = signal<1 | -1>(1);

  readonly elemFilters: { key: ElemFilter; label: string; cls: string }[] = [
    { key: 'all', label: 'Tous', cls: '' },
    { key: 'f',   label: 'Feu',      cls: 'elem-f' },
    { key: 'w',   label: 'Eau',      cls: 'elem-w' },
    { key: 'n',   label: 'Vent',     cls: 'elem-n' },
    { key: 'l',   label: 'Lumière',  cls: 'elem-l' },
    { key: 'd',   label: 'Ténèbres', cls: 'elem-d' },
  ];

  readonly enrichedUnits = computed<UnitWithMonster[]>(() => {
    const maxSkills = this.swAccountService.maxSkillLevels();
    return this.swAccountService.units().map(unit => {
      const monster = this.monsterService.getById(unit.unit_master_id) ?? null;
      const name = monster?.name ?? `#${unit.unit_master_id}`;
      const elem: Element | null = monster?.elem ?? null;
      const nat = monster?.nat ?? 0;
      const awakened = this.monsterService.isAwakened(unit.unit_master_id);
      const skillsSummary = this.getSkillsSummary(unit);
      const skillsMaxed = this.isSkillsMaxed(unit, maxSkills);
      return { unit, monster, name, elem, nat, awakened, skillsSummary, skillsMaxed };
    });
  });

  readonly filteredUnits = computed<UnitWithMonster[]>(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const elem = this.filterElem();
    const key = this.sortKey();
    const dir = this.sortDir();

    let list = this.enrichedUnits().filter(item => {
      const matchName = !q || item.name.toLowerCase().includes(q);
      const matchElem = elem === 'all' || item.elem === elem;
      return matchName && matchElem;
    });

    list = [...list].sort((a, b) => {
      let cmp = 0;
      if (key === 'name') cmp = a.name.localeCompare(b.name);
      else if (key === 'level') cmp = a.unit.unit_level - b.unit.unit_level;
      else if (key === 'nat') cmp = a.nat - b.nat;
      else if (key === 'stars') cmp = a.unit.class - b.unit.class;
      return cmp * dir;
    });

    return list;
  });

  ngOnInit(): void {
    this.monsterService.load();
  }

  getSkillsSummary(unit: SwUnit): string {
    if (!unit.skills?.length) return '—';
    return unit.skills.map(s => s[1]).join('/');
  }

  isSkillsMaxed(unit: SwUnit, maxSkills?: Map<number, number>): boolean {
    if (!unit.skills?.length) return false;
    const map = maxSkills ?? this.swAccountService.maxSkillLevels();
    return unit.skills.every(([skillId, level]) => {
      const maxLevel = map.get(skillId);
      return maxLevel !== undefined && level >= maxLevel;
    });
  }

  isMax(unit: SwUnit): boolean {
    return unit.class === 6 && unit.unit_level === 40;
  }

  getElemLabel(elem: Element | null): string {
    if (!elem) return '';
    return ELEMENT_LABELS[elem]?.label ?? '';
  }

  getElemClass(elem: Element | null): string {
    if (!elem) return '';
    return ELEMENT_LABELS[elem]?.cssClass ?? '';
  }

  starsArray(count: number): number[] {
    return Array.from({ length: count }, (_, i) => i);
  }

  toggleSort(key: SortKey): void {
    if (this.sortKey() === key) {
      this.sortDir.update(d => (d === 1 ? -1 : 1));
    } else {
      this.sortKey.set(key);
      this.sortDir.set(key === 'level' || key === 'stars' ? -1 : 1);
    }
  }
}
