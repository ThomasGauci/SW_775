import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, forkJoin, of } from 'rxjs';
import { Monster, Element } from '../../models/monster.model';

@Injectable({ providedIn: 'root' })
export class MonsterService {
  private _monsters = signal<Monster[]>([]);
  private _loaded  = signal(false);
  private _loading = signal(false);
  private _awakenIds = signal<Set<number>>(new Set());

  readonly monsters = this._monsters.asReadonly();
  readonly loaded   = this._loaded.asReadonly();
  readonly loading  = this._loading.asReadonly();

  constructor(private http: HttpClient) {}

  load(): void {
    if (this._loaded() || this._loading()) return;
    this._loading.set(true);

    const base$      = this.http.get<Monster[]>('assets/data/monsters.json');
    const patch$     = this.http.get<Partial<Monster>[]>('assets/data/monsters-patch.json')
      .pipe(catchError(() => of([] as Partial<Monster>[])));
    const images$    = this.http.get<Record<number, string>>('assets/data/monster-images.json')
      .pipe(catchError(() => of({} as Record<number, string>)));
    const awakenIds$ = this.http.get<number[]>('assets/data/awaken-ids.json')
      .pipe(catchError(() => of([] as number[])));

    forkJoin([base$, patch$, images$, awakenIds$]).subscribe({
      next: ([base, patches, imageMap, awakenIds]) => {
        // Normalize base64 prefix (only for actual base64 strings, not URLs)
        const normalized = base.map(m => ({
          ...m,
          img: m.img && !m.img.startsWith('data:') && !m.img.startsWith('http')
            ? `data:image/webp;base64,${m.img}`
            : m.img,
        }));

        // Apply patches: override fields by ID, or add new entry
        const map = new Map<number, Monster>(normalized.map(m => [m.id, m]));
        for (const patch of patches) {
          if (!patch.id) continue;
          const existing = map.get(patch.id);
          if (existing) {
            map.set(patch.id, { ...existing, ...patch });
          } else {
            // New monster added via patch (img optional)
            map.set(patch.id, patch as Monster);
          }
        }

        // Fill missing images from imageMap (CDN URLs — use as-is)
        for (const [id, monster] of map) {
          if (!monster.img && imageMap[id]) {
            monster.img = imageMap[id];
          }
        }

        // Store awaken IDs
        this._awakenIds.set(new Set(awakenIds));

        const sorted = Array.from(map.values())
          .sort((a, b) => a.name.localeCompare(b.name));

        this._monsters.set(sorted);
        this._loaded.set(true);
        this._loading.set(false);
      },
      error: () => {
        this._monsters.set([]);
        this._loaded.set(true);
        this._loading.set(false);
      }
    });
  }

  isAwakened(id: number): boolean {
    return this._awakenIds().has(id);
  }

  search(query: string, elem?: Element | 'all', nat?: number | 'all'): Monster[] {
    const q = query.toLowerCase().trim();
    return this._monsters().filter(m => {
      const matchName = !q || m.name.toLowerCase().includes(q);
      const matchElem = !elem || elem === 'all' || m.elem === elem;
      const matchNat  = !nat  || nat  === 'all' || m.nat  === nat;
      return matchName && matchElem && matchNat;
    });
  }

  getById(id: number): Monster | undefined {
    return this._monsters().find(m => m.id === id);
  }
}
