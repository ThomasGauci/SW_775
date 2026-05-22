import {
  Component, Input, Output, EventEmitter, ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Battle } from '../../models/battle.model';
import { Monster, ELEMENT_LABELS } from '../../models/monster.model';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HistoryComponent {
  @Input() battles: Battle[] = [];
  @Input() loading = false;
  @Output() deleteBattle = new EventEmitter<number>();

  getElemEmoji(elem: Monster['elem']): string {
    return ELEMENT_LABELS[elem]?.emoji ?? '';
  }

  getNatStars(nat: number): string {
    return '★'.repeat(nat);
  }

  onDelete(id: number): void {
    this.deleteBattle.emit(id);
  }

  trackById(_: number, battle: Battle): number {
    return battle.id;
  }
}
