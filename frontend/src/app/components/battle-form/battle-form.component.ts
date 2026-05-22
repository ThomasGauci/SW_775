import {
  Component, Output, EventEmitter, signal, computed, ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Monster } from '../../models/monster.model';
import { MonsterPickerComponent } from '../monster-picker/monster-picker.component';

interface PickerTarget {
  team: 'att' | 'def';
  index: number;
}

@Component({
  selector: 'app-battle-form',
  standalone: true,
  imports: [CommonModule, FormsModule, MonsterPickerComponent],
  templateUrl: './battle-form.component.html',
  styleUrls: ['./battle-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BattleFormComponent {
  @Output() battleSubmit = new EventEmitter<{
    att: Monster[];
    def: Monster[];
    winner: 'att' | 'def';
  }>();

  attTeam = signal<(Monster | null)[]>([null, null, null]);
  defTeam = signal<(Monster | null)[]>([null, null, null]);
  winner = signal<'att' | 'def'>('att');
  pickerTarget = signal<PickerTarget | null>(null);

  readonly allSelectedIds = computed(() => {
    const att = this.attTeam().filter((m): m is Monster => m !== null).map(m => m.id);
    const def = this.defTeam().filter((m): m is Monster => m !== null).map(m => m.id);
    return [...att, ...def];
  });

  readonly isValid = computed(() => {
    const attFull = this.attTeam().every(m => m !== null);
    const defFull = this.defTeam().every(m => m !== null);
    return attFull && defFull;
  });

  openPicker(team: 'att' | 'def', index: number): void {
    this.pickerTarget.set({ team, index });
  }

  closePicker(): void {
    this.pickerTarget.set(null);
  }

  onMonsterSelected(monster: Monster): void {
    const target = this.pickerTarget();
    if (!target) return;

    if (target.team === 'att') {
      const team = [...this.attTeam()];
      team[target.index] = monster;
      this.attTeam.set(team);
    } else {
      const team = [...this.defTeam()];
      team[target.index] = monster;
      this.defTeam.set(team);
    }
    this.closePicker();
  }

  removeMonster(team: 'att' | 'def', index: number): void {
    if (team === 'att') {
      const t = [...this.attTeam()];
      t[index] = null;
      this.attTeam.set(t);
    } else {
      const t = [...this.defTeam()];
      t[index] = null;
      this.defTeam.set(t);
    }
  }

  submit(): void {
    if (!this.isValid()) return;
    this.battleSubmit.emit({
      att: this.attTeam() as Monster[],
      def: this.defTeam() as Monster[],
      winner: this.winner()
    });
    this.reset();
  }

  reset(): void {
    this.attTeam.set([null, null, null]);
    this.defTeam.set([null, null, null]);
    this.winner.set('att');
  }

  getNatStars(nat: number): string {
    return '★'.repeat(nat);
  }
}
