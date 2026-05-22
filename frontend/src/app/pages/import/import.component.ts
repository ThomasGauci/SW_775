import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SwAccountService } from '../../core/services/sw-account.service';
import { SwAccountData } from '../../models/sw-account.model';

@Component({
  selector: 'app-import',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportComponent {
  readonly swAccountService = inject(SwAccountService);

  isDragging = signal(false);
  importing = signal(false);
  error = signal('');
  success = signal(false);
  importedData = signal<SwAccountData | null>(null);

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this._import(file);
    }
    // Reset input so the same file can be re-selected
    input.value = '';
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
    const file = event.dataTransfer?.files?.[0];
    if (file) {
      this._import(file);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(true);
  }

  onDragLeave(): void {
    this.isDragging.set(false);
  }

  private _import(file: File): void {
    if (!file.name.endsWith('.json')) {
      this.error.set('Veuillez sélectionner un fichier JSON.');
      return;
    }
    this.importing.set(true);
    this.error.set('');
    this.success.set(false);

    this.swAccountService.importFile(file)
      .then(data => {
        this.importedData.set(data);
        this.success.set(true);
        this.importing.set(false);
      })
      .catch((err: Error) => {
        this.error.set(err.message);
        this.importing.set(false);
      });
  }

  clear(): void {
    this.swAccountService.clear();
    this.success.set(false);
    this.error.set('');
    this.importedData.set(null);
  }

  formatDate(isoString: string): string {
    return new Date(isoString).toLocaleString('fr-FR');
  }

  get currentData() {
    return this.swAccountService.data();
  }

  sumEquippedRunes(acc: number, unit: { runes: any[] }): number {
    return acc + (unit.runes?.length ?? 0);
  }
}
