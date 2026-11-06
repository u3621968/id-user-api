import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager'; // 注意这里的 import type
import { randomUUID } from 'crypto'; // 用 Node 自带的，不用 uuid 包了
import { UserId } from './user-id.entity';

@Injectable()
export class UserIdService {
  constructor(
    @InjectRepository(UserId)
    private readonly repo: Repository<UserId>,
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache,
  ) {}

  async findOrCreate(id1: string, id2: string): Promise<string> {
    const cacheKey = `userid:${id1}:${id2}`;

    const cached = await this.cache.get<string>(cacheKey);
    if (cached) return cached;

    const existing = await this.repo.findOne({ where: { id1, id2 } });
    if (existing) {
      await this.cache.set(cacheKey, existing.userID);
      return existing.userID;
    }

    const newUserID = randomUUID(); // 生成 UUID
    try {
      const record = this.repo.create({ id1, id2, userID: newUserID });
      await this.repo.save(record);
      await this.cache.set(cacheKey, newUserID);
      return newUserID;
    } catch (error) {
      if (error instanceof QueryFailedError && (error as any).driverError?.code === 'ER_DUP_ENTRY') {
        const winner = await this.repo.findOne({ where: { id1, id2 } });
        if (winner) {
          await this.cache.set(cacheKey, winner.userID);
          return winner.userID;
        }
      }
      throw error;
    }
  }
}
