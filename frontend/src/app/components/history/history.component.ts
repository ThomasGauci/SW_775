import {
  Component, Input, Output, EventEmitter, ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Battle } from '../../models/battle.model';
import { MonsterService } from '../../core/services/monster.service';
import { SafeUrlPipe } from '../../core/pipes/safe-url.pipe';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, DatePipe, SafeUrlPipe],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HistoryComponent {
  @Input() battles: Battle[] = [];
  @Input() loading = false;
  @Output() deleteBattle = new EventEmitter<number>();

  constructor(private monsterService: MonsterService) {}

  getImg(monsterId: number): string | undefined {
    return this.monsterService.getById(monsterId)?.img;
  }

  onDelete(id: number): void {
    this.deleteBattle.emit(id);
  }
}
