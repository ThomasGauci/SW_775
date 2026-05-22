import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Battle, BattleStats } from '../../models/battle.model';
import { Monster } from '../../models/monster.model';

@Injectable({ providedIn: 'root' })
export class BattleService {
  private readonly apiUrl = `${environment.apiUrl}/battles`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Battle[]> {
    return this.http.get<Battle[]>(this.apiUrl);
  }

  create(payload: { att: Monster[]; def: Monster[]; winner: 'att' | 'def' }): Observable<Battle> {
    const toSlot = (m: Monster) => ({ monsterId: m.id, name: m.name, elem: m.elem, nat: m.nat });
    const body = {
      date: new Date().toISOString(),
      att: payload.att.map(toSlot),
      def: payload.def.map(toSlot),
      winner: payload.winner,
    };
    return this.http.post<Battle>(this.apiUrl, body);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getStats(): Observable<BattleStats> {
    return this.http.get<BattleStats>(`${this.apiUrl}/stats`);
  }
}
