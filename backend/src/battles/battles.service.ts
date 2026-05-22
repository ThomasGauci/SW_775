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

export interface BattleStats {
  total: number;
  wins: number;
  losses: number;
  winRate: number;
  topMonsters: MonsterStats[];
}

@Injectable()
export class BattlesService {
  constructor(
    @InjectRepository(Battle)
    private readonly battlesRepository: Repository<Battle>,
  ) {}

  async findAll(userId: number): Promise<Battle[]> {
    return this.battlesRepository.find({
      where: { userId },
      order: { date: 'DESC', createdAt: 'DESC' },
    });
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

    if (!battle) {
      throw new NotFoundException(`Battle with id ${id} not found`);
    }

    if (battle.userId !== userId) {
      throw new ForbiddenException('You do not own this battle record');
    }

    await this.battlesRepository.remove(battle);
  }

  async getStats(userId: number): Promise<BattleStats> {
    const battles = await this.findAll(userId);

    const total = battles.length;
    const wins = battles.filter((b) => b.winner === 'att').length;
    const losses = total - wins;
    const winRate = total > 0 ? Math.round((wins / total) * 100 * 100) / 100 : 0;

    // Aggregate monster usage and win data
    const monsterMap = new Map<
      number,
      { name: string; elem: string; nat: number; usage: number; wins: number }
    >();

    for (const battle of battles) {
      const isWin = battle.winner === 'att';

      for (const monster of battle.att) {
        const existing = monsterMap.get(monster.monsterId);
        if (existing) {
          existing.usage += 1;
          if (isWin) existing.wins += 1;
        } else {
          monsterMap.set(monster.monsterId, {
            name: monster.name,
            elem: monster.elem,
            nat: monster.nat,
            usage: 1,
            wins: isWin ? 1 : 0,
          });
        }
      }
    }

    // Build sorted top-10 list
    const topMonsters: MonsterStats[] = Array.from(monsterMap.entries())
      .map(([monsterId, stats]) => ({
        monsterId,
        name: stats.name,
        elem: stats.elem,
        nat: stats.nat,
        usage: stats.usage,
        wins: stats.wins,
        winRate:
          stats.usage > 0
            ? Math.round((stats.wins / stats.usage) * 100 * 100) / 100
            : 0,
      }))
      .sort((a, b) => b.usage - a.usage || b.winRate - a.winRate)
      .slice(0, 10);

    return { total, wins, losses, winRate, topMonsters };
  }
}
