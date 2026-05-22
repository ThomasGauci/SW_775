import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Battle, MonsterSlot } from './entities/battle.entity';
import { CreateBattleDto } from './dto/create-battle.dto';

export interface MonsterStats {
  monsterId: number;
  name: string;
  elem: string;
  nat: number;
  usage: number;
  wins: number;
  winRate: number;
}

export interface TeamStat {
  monsters: { monsterId: number; name: string; elem: string; nat: number }[];
  usage: number;
  wins: number;
  winRate: number;
}

export interface BattleStats {
  total: number;
  wins: number;
  losses: number;
  winRate: number;
  topMonsters: MonsterStats[];
  topTeams: TeamStat[];
}

@Injectable()
export class BattlesService {
  constructor(
    @InjectRepository(Battle)
    private readonly battlesRepository: Repository<Battle>,
  ) {}

  async findAll(userId: number): Promise<any[]> {
    const battles = await this.battlesRepository.find({
      where: { userId },
      order: { date: 'DESC', createdAt: 'DESC' },
    });
    // Normalize monsterId → id so the frontend Battle model works
    return battles.map((b) => ({
      id: b.id,
      date: b.date,
      winner: b.winner,
      createdAt: b.createdAt,
      att: b.att.map((s) => ({ id: s.monsterId, name: s.name, elem: s.elem, nat: s.nat })),
      def: b.def.map((s) => ({ id: s.monsterId, name: s.name, elem: s.elem, nat: s.nat })),
    }));
  }

  async create(userId: number, dto: CreateBattleDto): Promise<Battle> {
    const battle = this.battlesRepository.create({
      userId,
      date: dto.date,
      att: dto.att as MonsterSlot[],
      def: dto.def as MonsterSlot[],
      winner: dto.winner,
    });
    return this.battlesRepository.save(battle);
  }

  async delete(id: number, userId: number): Promise<void> {
    const battle = await this.battlesRepository.findOne({ where: { id } });
    if (!battle) throw new NotFoundException(`Battle ${id} not found`);
    if (battle.userId !== userId) throw new ForbiddenException('You do not own this battle');
    await this.battlesRepository.remove(battle);
  }

  async getStats(userId: number): Promise<BattleStats> {
    const battles = await this.battlesRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    const total = battles.length;
    const wins = battles.filter((b) => b.winner === 'att').length;
    const losses = total - wins;
    const winRate = total > 0 ? wins / total : 0;

    // ── Monster stats (attack side only) ──────────────────────────────────
    const monsterMap = new Map<
      number,
      { name: string; elem: string; nat: number; usage: number; wins: number }
    >();

    for (const battle of battles) {
      const isWin = battle.winner === 'att';
      for (const m of battle.att) {
        const entry = monsterMap.get(m.monsterId);
        if (entry) {
          entry.usage++;
          if (isWin) entry.wins++;
        } else {
          monsterMap.set(m.monsterId, {
            name: m.name,
            elem: m.elem,
            nat: m.nat,
            usage: 1,
            wins: isWin ? 1 : 0,
          });
        }
      }
    }

    const topMonsters: MonsterStats[] = Array.from(monsterMap.entries())
      .map(([monsterId, s]) => ({
        monsterId,
        name: s.name,
        elem: s.elem,
        nat: s.nat,
        usage: s.usage,
        wins: s.wins,
        winRate: s.usage > 0 ? s.wins / s.usage : 0,
      }))
      .sort((a, b) => b.usage - a.usage || b.winRate - a.winRate);

    // ── Team stats (attack side, order-independent) ────────────────────────
    const teamMap = new Map<
      string,
      { monsters: MonsterSlot[]; usage: number; wins: number }
    >();

    for (const battle of battles) {
      const sorted = [...battle.att].sort((a, b) => a.monsterId - b.monsterId);
      const key = sorted.map((m) => m.monsterId).join(',');
      const isWin = battle.winner === 'att';
      const entry = teamMap.get(key);
      if (entry) {
        entry.usage++;
        if (isWin) entry.wins++;
      } else {
        teamMap.set(key, { monsters: sorted, usage: 1, wins: isWin ? 1 : 0 });
      }
    }

    const topTeams: TeamStat[] = Array.from(teamMap.values())
      .map((t) => ({
        monsters: t.monsters.map((m) => ({
          monsterId: m.monsterId,
          name: m.name,
          elem: m.elem,
          nat: m.nat,
        })),
        usage: t.usage,
        wins: t.wins,
        winRate: t.usage > 0 ? t.wins / t.usage : 0,
      }))
      .sort((a, b) => b.usage - a.usage || b.winRate - a.winRate);

    return { total, wins, losses, winRate, topMonsters, topTeams };
  }
}
