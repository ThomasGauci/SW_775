import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Monster, Element } from '../../models/monster.model';

@Injectable({ providedIn: 'root' })
export class MonsterService {
  private _monsters = signal<Monster[]>([]);
  private _loaded = signal(false);
  private _loading = signal(false);

  readonly monsters = this._monsters.asReadonly();
  readonly loaded = this._loaded.asReadonly();
  readonly loading = this._loading.asReadonly();

  constructor(private http: HttpClient) {}

  load(): void {
    if (this._loaded() || this._loading()) return;
    this._loading.set(true);
    this.http.get<Monster[]>('assets/data/monsters.json').subscribe({
      next: (data) => {
        const monsters = data.map(m => ({
          ...m,
          img: m.img && !m.img.startsWith('data:')
            ? `data:image/webp;base64,${m.img}`
            : m.img,
        }));
        this._monsters.set(monsters);
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

  search(query: string, elem?: Element | 'all', nat?: number | 'all'): Monster[] {
    const q = query.toLowerCase().trim();
    return this._monsters().filter(m => {
      const matchName = !q || m.name.toLowerCase().includes(q);
      const matchElem = !elem || elem === 'all' || m.elem === elem;
      const matchNat = !nat || nat === 'all' || m.nat === nat;
      return matchName && matchElem && matchNat;
    });
  }

  getById(id: number): Monster | undefined {
    return this._monsters().find(m => m.id === id);
  }
}
