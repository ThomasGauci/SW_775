import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export interface MonsterSlot {
  monsterId: number;
  name: string;
  elem: 'f' | 'w' | 'n' | 'l' | 'd';
  nat: number;
}

@Entity('battles')
export class Battle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.battles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'jsonb' })
  att: MonsterSlot[];

  @Column({ type: 'jsonb' })
  def: MonsterSlot[];

  @Column({ type: 'varchar', length: 3 })
  winner: 'att' | 'def';

  @CreateDateColumn()
  createdAt: Date;
}
