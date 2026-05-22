export interface BattleMonster {
  id: number;
  name: string;
  elem: string;
  nat: number;
}

export interface Battle {
  id: number;
  date: string;
  att: BattleMonster[];
  def: BattleMonster[];
  winner: 'att' | 'def';
}

export interface TopMonsterStat {
  monsterId: number;
  name: string;
  elem: string;
  nat: number;
  usage: number;
  wins: number;
  winRate: number;
}

export interface StatMonster {
  monsterId: number;
  name: string;
  elem: string;
  nat: number;
}

export interface TopTeamStat {
  monsters: StatMonster[];
  usage: number;
  wins: number;
  winRate: number;
}

export interface BattleStats {
  total: number;
  wins: number;
  losses: number;
  winRate: number;
  topMonsters: TopMonsterStat[];
  topTeams: TopTeamStat[];
}
