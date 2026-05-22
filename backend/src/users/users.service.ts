import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { RegisterDto } from '../auth/dto/register.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findOne(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async create(dto: RegisterDto): Promise<User> {
    const existingEmail = await this.usersRepository.findOne({
      where: { email: dto.email },
    });
    if (existingEmail) {
      throw new ConflictException('Email already in use');
    }

    const existingUsername = await this.usersRepository.findOne({
      where: { username: dto.username },
    });
    if (existingUsername) {
      throw new ConflictException('Username already in use');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = this.usersRepository.create({
      email: dto.email,
      username: dto.username,
      password: hashedPassword,
    });

    return this.usersRepository.save(user);
  }
}
