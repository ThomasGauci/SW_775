import { Component, Input, OnChanges, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BattleStats, TopMonsterStat, TopTeamStat } from '../../models/battle.model';
import { MonsterService } from '../../core/services/monster.service';
import { SafeUrlPipe } from '../../core/pipes/safe-url.pipe';

type MonsterSortKey = 'name' | 'usage' | 'wins' | 'winRate';
type TeamSortKey    = 'usage' | 'wins' | 'winRate';
type SortDir        = 'asc' | 'desc';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule, NgIf, FormsModule, SafeUrlPipe],
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatisticsComponent implements OnChanges {
  @Input() stats: BattleStats | null = null;
  @Input() loading = false;

  /* ── search state ── */
  readonly monsterSearch = signal('');
  readonly teamSearch    = signal('');

  /* ── monster sort state ── */
  readonly mSortKey = signal<MonsterSortKey>('usage');
  readonly mSortDir = signal<SortDir>('desc');

  /* ── team sort state ── */
  readonly tSortKey = signal<TeamSortKey>('usage');
  readonly tSortDir = signal<SortDir>('desc');

  /* ── raw lists (updated on @Input change) ── */
  private readonly _monsters = signal<TopMonsterStat[]>([]);
  private readonly _teams    = signal<TopTeamStat[]>([]);

  /* ── derived: filtered + sorted monsters ── */
  readonly filteredMonsters = computed(() => {
    const q = this.monsterSearch().toLowerCase().trim();
    let list = this._monsters();
    if (q) list = list.filter(m => m.name.toLowerCase().includes(q));

    const key = this.mSortKey();
    const dir = this.mSortDir() === 'asc' ? 1 : -1;
    return [...list].sort((a, b) => {
      if (key === 'name') return dir * a.name.localeCompare(b.name);
      return dir * (a[key] - b[key]);
    });
  });

  /* ── derived: filtered + sorted teams ── */
  readonly filteredTeams = computed(() => {
    const q = this.teamSearch().toLowerCase().trim();
    let list = this._teams();
    if (q) list = list.filter(t =>
      t.monsters.some(m => m.name.toLowerCase().includes(q))
    );

    const key = this.tSortKey();
    const dir = this.tSortDir() === 'asc' ? 1 : -1;
    return [...list].sort((a, b) => dir * (a[key] - b[key]));
  });

  constructor(private monsterService: MonsterService) {}

  ngOnChanges(): void {
    this._monsters.set(this.stats?.topMonsters ?? []);
    this._teams.set(this.stats?.topTeams ?? []);
    /* reset search when data changes */
    this.monsterSearch.set('');
    this.teamSearch.set('');
  }

  /* ── sort helpers ── */
  sortMonsters(key: MonsterSortKey): void {
    if (this.mSortKey() === key) {
      this.mSortDir.update(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      this.mSortKey.set(key);
      this.mSortDir.set(key === 'name' ? 'asc' : 'desc');
    }
  }

  sortTeams(key: TeamSortKey): void {
    if (this.tSortKey() === key) {
      this.tSortDir.update(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      this.tSortKey.set(key);
      this.tSortDir.set('desc');
    }
  }

  mSortIcon(key: MonsterSortKey): string {
    if (this.mSortKey() !== key) return '';
    return this.mSortDir() === 'asc' ? ' ▲' : ' ▼';
  }

  tSortIcon(key: TeamSortKey): string {
    if (this.tSortKey() !== key) return '';
    return this.tSortDir() === 'asc' ? ' ▲' : ' ▼';
  }

  /* ── display helpers ── */
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
