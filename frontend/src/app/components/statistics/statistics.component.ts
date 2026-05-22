import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { BattleStats } from '../../models/battle.model';
import { MonsterService } from '../../core/services/monster.service';
import { SafeUrlPipe } from '../../core/pipes/safe-url.pipe';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule, NgIf, SafeUrlPipe],
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatisticsComponent {
  @Input() stats: BattleStats | null = null;
  @Input() loading = false;

  constructor(private monsterService: MonsterService) {}

  getImg(monsterId: number): string | undefined {
    return this.monsterService.getById(monsterId)?.img;
  }

  pct(rate: number): string {
    return `${Math.round(rate * 100)}%`;
  }

  barWidth(rate: number): string {
    return `${Math.min(100, Math.round(rate * 100))}%`;
  }

  getNatStars(nat: number): string {
    return '★'.repeat(nat);
  }
}
