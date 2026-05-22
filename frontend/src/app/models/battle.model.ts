import { Monster } from './monster.model';

export interface Battle {
  id: number;
  date: string;
  att: Monster[];  // 3 items
  def: Monster[];  // 3 items
  winner: 'att' | 'def';
}

export interface BattleStats {
  total: number;
  wins: number;
  losses: number;
  winRate: number;
  topMonsters: TopMonsterStat[];
}

export interface TopMonsterStat {
  monster: Monster;
  appearances: number;
  wins: number;
  winRate: number;
}
