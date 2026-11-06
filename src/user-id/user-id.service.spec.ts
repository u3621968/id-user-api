import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { UserIdService } from './user-id.service';
import { UserId } from './user-id.entity';

describe('UserIdService', () => {
  let service: UserIdService;
  let repo: any;
  let cache: any;

  beforeEach(async () => {
    repo = {
      findOne: jest.fn(),
      create: jest.fn((dto) => dto),
      save: jest.fn().mockResolvedValue({}),
    };
    cache = {
      get: jest.fn().mockResolvedValue(null),
      set: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserIdService,
        { provide: getRepositoryToken(UserId), useValue: repo },
        { provide: CACHE_MANAGER, useValue: cache },
      ],
    }).compile();

    service = module.get<UserIdService>(UserIdService);
  });

  it('should return cached userID if exists', async () => {
    cache.get.mockResolvedValue('cached-uuid-123');
    const result = await service.findOrCreate('id1', 'id2');
    expect(result).toBe('cached-uuid-123');
  });

  it('should return existing userID from database if record exists', async () => {
    cache.get.mockResolvedValue(null);
    repo.findOne.mockResolvedValue({ userID: 'existing-uuid-456' });
    
    const result = await service.findOrCreate('id1', 'id2');
    expect(result).toBe('existing-uuid-456');
  });

  it('should generate new UUID and save to database if not exists', async () => {
    cache.get.mockResolvedValue(null);
    repo.findOne.mockResolvedValue(null);
    
    const result = await service.findOrCreate('new-id1', 'new-id2');
    
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(10);
    expect(repo.save).toHaveBeenCalled();
    expect(cache.set).toHaveBeenCalled();
  });
});