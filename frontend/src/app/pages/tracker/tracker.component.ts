import {
  Component, OnInit, signal, ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BattleService } from '../../core/services/battle.service';
import { Battle, BattleStats } from '../../models/battle.model';
import { Monster } from '../../models/monster.model';
import { BattleFormComponent } from '../../components/battle-form/battle-form.component';
import { HistoryComponent } from '../../components/history/history.component';
import { StatisticsComponent } from '../../components/statistics/statistics.component';

type Tab = 'form' | 'history' | 'stats';

@Component({
  selector: 'app-tracker',
  standalone: true,
  imports: [CommonModule, BattleFormComponent, HistoryComponent, StatisticsComponent],
  templateUrl: './tracker.component.html',
  styleUrls: ['./tracker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrackerComponent implements OnInit {
  activeTab = signal<Tab>('form');
  battles = signal<Battle[]>([]);
  stats = signal<BattleStats | null>(null);
  loadingBattles = signal(false);
  loadingStats = signal(false);
  submitting = signal(false);
  errorMsg = signal<string | null>(null);
  successMsg = signal<string | null>(null);

  constructor(
    private battleService: BattleService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadBattles();
    this.loadStats();
  }

  setTab(tab: Tab): void {
    this.activeTab.set(tab);
    this.errorMsg.set(null);
    this.successMsg.set(null);
  }

  loadBattles(): void {
    this.loadingBattles.set(true);
    this.battleService.getAll().subscribe({
      next: (battles) => {
        this.battles.set(battles);
        this.loadingBattles.set(false);
        this.cdr.markForCheck();
      },
      error: () => {
        this.loadingBattles.set(false);
        this.cdr.markForCheck();
      }
    });
  }

  loadStats(): void {
    this.loadingStats.set(true);
    this.battleService.getStats().subscribe({
      next: (stats) => {
        this.stats.set(stats);
        this.loadingStats.set(false);
        this.cdr.markForCheck();
      },
      error: () => {
        this.loadingStats.set(false);
        this.cdr.markForCheck();
      }
    });
  }

  onBattleSubmit(payload: { att: Monster[]; def: Monster[]; winner: 'att' | 'def' }): void {
    if (this.submitting()) return;
    this.submitting.set(true);
    this.errorMsg.set(null);
    this.successMsg.set(null);

    this.battleService.create(payload).subscribe({
      next: () => {
        this.submitting.set(false);
        this.successMsg.set('Combat enregistré avec succès !');
        this.loadBattles();
        this.loadStats();
        setTimeout(() => this.successMsg.set(null), 3000);
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.submitting.set(false);
        this.errorMsg.set(err?.error?.message ?? 'Erreur lors de l\'enregistrement.');
        this.cdr.markForCheck();
      }
    });
  }

  onDeleteBattle(id: number): void {
    this.battleService.delete(id).subscribe({
      next: () => {
        this.battles.update(list => list.filter(b => b.id !== id));
        this.loadStats();
        this.cdr.markForCheck();
      },
      error: () => {
        this.cdr.markForCheck();
      }
    });
  }

}
