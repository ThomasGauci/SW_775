import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BattlesService } from './battles.service';
import { BattlesController } from './battles.controller';
import { Battle } from './entities/battle.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Battle])],
  providers: [BattlesService],
  controllers: [BattlesController],
})
export class BattlesModule {}
