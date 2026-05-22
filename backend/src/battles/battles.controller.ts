import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BattlesService } from './battles.service';
import { CreateBattleDto } from './dto/create-battle.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('battles')
@UseGuards(JwtAuthGuard)
export class BattlesController {
  constructor(private readonly battlesService: BattlesService) {}

  @Get()
  findAll(@Request() req: any) {
    return this.battlesService.findAll(req.user.id);
  }

  @Get('stats')
  getStats(@Request() req: any) {
    return this.battlesService.getStats(req.user.id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Request() req: any, @Body() createBattleDto: CreateBattleDto) {
    return this.battlesService.create(req.user.id, createBattleDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    await this.battlesService.delete(id, req.user.id);
  }
}
