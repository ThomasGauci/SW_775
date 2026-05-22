import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BattleStats } from '../../models/battle.model';
import { ELEMENT_LABELS, Monster } from '../../models/monster.model';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatisticsComponent {
  @Input() stats: BattleStats | null = null;
  @Input() loading = false;

  getElemEmoji(elem: Monster['elem']): string {
    return ELEMENT_LABELS[elem]?.emoji ?? '';
  }

  getNatStars(nat: number): string {
    return '★'.repeat(nat);
  }

  getWinRateWidth(rate: number): string {
    return `${Math.round(rate * 100)}%`;
  }

  formatPct(rate: number): string {
    return `${Math.round(rate * 100)}%`;
  }
}
