import {
  Component, OnInit, Output, EventEmitter, Input,
  signal, computed, ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MonsterService } from '../../core/services/monster.service';
import { Monster, Element, ELEMENT_LABELS } from '../../models/monster.model';
import { SafeUrlPipe } from '../../core/pipes/safe-url.pipe';

type ElemFilter = 'all' | Element;
type NatFilter = 'all' | 2 | 3 | 4 | 5;

@Component({
  selector: 'app-monster-picker',
  standalone: true,
  imports: [CommonModule, FormsModule, SafeUrlPipe],
  templateUrl: './monster-picker.component.html',
  styleUrls: ['./monster-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MonsterPickerComponent implements OnInit {
  @Input() excludeIds: number[] = [];
  @Output() selected = new EventEmitter<Monster>();
  @Output() closed = new EventEmitter<void>();

  searchQuery = signal('');
  elemFilter = signal<ElemFilter>('all');
  natFilter = signal<NatFilter>('all');

  readonly elementLabels = ELEMENT_LABELS;
  readonly elements: ElemFilter[] = ['all', 'f', 'w', 'n', 'l', 'd'];
  readonly nats: NatFilter[] = ['all', 2, 3, 4, 5];

  readonly filteredMonsters = computed(() => {
    const q = this.searchQuery();
    const elem = this.elemFilter();
    const nat = this.natFilter();
    return this.monsterService
      .search(q, elem === 'all' ? undefined : elem, nat === 'all' ? undefined : nat)
      .filter(m => !this.excludeIds.includes(m.id));
  });

  constructor(readonly monsterService: MonsterService) {}

  ngOnInit(): void {
    this.monsterService.load();
  }

  selectMonster(monster: Monster): void {
    this.selected.emit(monster);
  }

  close(): void {
    this.closed.emit();
  }

  setSearch(value: string): void {
    this.searchQuery.set(value);
  }

  setElem(elem: ElemFilter): void {
    this.elemFilter.set(elem);
  }

  setNat(nat: NatFilter): void {
    this.natFilter.set(nat);
  }

  getElemLabel(elem: ElemFilter): string {
    if (elem === 'all') return 'Tous';
    return ELEMENT_LABELS[elem]?.label ?? elem;
  }

  getNatStars(nat: number): string {
    return '★'.repeat(nat);
  }

  stopPropagation(event: Event): void {
    event.stopPropagation();
  }
}
