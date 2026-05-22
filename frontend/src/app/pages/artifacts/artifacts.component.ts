import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SwAccountService } from '../../core/services/sw-account.service';
import { SwArtifact } from '../../models/sw-account.model';
import {
  ARTIFACT_ATTRIBUTES,
  ARTIFACT_STYLES,
  ARTIFACT_PRI_EFFECTS,
  ARTIFACT_SEC_EFFECTS,
} from '../../core/constants/sw-constants';

type SortKey = 'level' | 'rank' | 'type';

@Component({
  selector: 'app-artifacts',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './artifacts.component.html',
  styleUrls: ['./artifacts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtifactsComponent {
  readonly swAccountService = inject(SwAccountService);

  filterType = signal<'all' | 1 | 2>('all');
  filterAttribute = signal<number | 'all'>('all');
  filterStyle = signal<number | 'all'>('all');
  filterEquipped = signal<'all' | 'equipped' | 'unequipped'>('all');
  sortKey = signal<SortKey>('level');
  sortDir = signal<1 | -1>(-1);

  readonly attributeKeys = Object.keys(ARTIFACT_ATTRIBUTES).map(Number).filter(k => k !== 98).sort((a, b) => a - b);
  readonly styleKeys = Object.keys(ARTIFACT_STYLES).map(Number).filter(k => k !== 98).sort((a, b) => a - b);

  readonly filteredArtifacts = computed<SwArtifact[]>(() => {
    const typeF = this.filterType();
    const attrF = this.filterAttribute();
    const styleF = this.filterStyle();
    const equippedF = this.filterEquipped();
    const key = this.sortKey();
    const dir = this.sortDir();

    let list = this.swAccountService.artifacts().filter(a => {
      if (typeF !== 'all' && a.type !== typeF) return false;
      if (attrF !== 'all' && a.type === 1 && a.attribute !== attrF) return false;
      if (styleF !== 'all' && a.type === 2 && a.unit_style !== styleF) return false;
      if (equippedF === 'equipped' && a.occupied_id === 0) return false;
      if (equippedF === 'unequipped' && a.occupied_id !== 0) return false;
      return true;
    });

    list = [...list].sort((a, b) => {
      let cmp = 0;
      if (key === 'level') cmp = a.level - b.level;
      else if (key === 'rank') cmp = a.rank - b.rank;
      else if (key === 'type') cmp = a.type - b.type;
      return cmp * dir;
    });

    return list;
  });

  getTypeLabel(type: number): string {
    return type === 1 ? 'Attribut' : type === 2 ? 'Archétype' : `Type ${type}`;
  }

  getAttributeLabel(attr: number): string {
    return ARTIFACT_ATTRIBUTES[attr] ?? `Attr ${attr}`;
  }

  getStyleLabel(style: number): string {
    return ARTIFACT_STYLES[style] ?? `Style ${style}`;
  }

  getPriEffectLabel(art: SwArtifact): string {
    if (!art.pri_effect?.length) return '—';
    const statId = art.pri_effect[0];
    const val = art.pri_effect[2];
    const statName = ARTIFACT_PRI_EFFECTS[statId] ?? `Stat${statId}`;
    return `${statName} +${val}%`;
  }

  getEffectLabel(effectArr: number[]): string {
    if (!effectArr?.length || effectArr[0] === 0) return '';
    const id = effectArr[0];
    const val = effectArr[1];
    const base = ARTIFACT_SEC_EFFECTS[id] ?? `Effet ${id}`;
    return `${base}: +${val}%`;
  }

  getEquippedOn(art: SwArtifact): string {
    if (art.occupied_id === 0) return 'Inventaire';
    const unit = this.swAccountService.units().find(u => u.unit_id === art.occupied_id);
    if (!unit) return `#${art.occupied_id}`;
    return `#${unit.unit_master_id} (Lvl ${unit.unit_level})`;
  }

  getTypeClass(type: number): string {
    return type === 1 ? 'type-attr' : type === 2 ? 'type-arch' : '';
  }

  getLevelClass(level: number): string {
    if (level >= 15) return 'level-max';
    if (level >= 12) return 'level-high';
    if (level >= 9) return 'level-mid';
    return 'level-low';
  }

  getAttrClass(attr: number): string {
    const map: Record<number, string> = { 1: 'f', 2: 'w', 3: 'n', 4: 'l', 5: 'd' };
    return map[attr] ? `elem-${map[attr]}` : '';
  }

  toggleSort(key: SortKey): void {
    if (this.sortKey() === key) {
      this.sortDir.update(d => (d === 1 ? -1 : 1));
    } else {
      this.sortKey.set(key);
      this.sortDir.set(key === 'level' || key === 'rank' ? -1 : 1);
    }
  }
}
