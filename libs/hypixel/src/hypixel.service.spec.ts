import { Test, TestingModule } from '@nestjs/testing';
import { HypixelService } from './hypixel.service';

describe('HypixelService', () => {
  let service: HypixelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HypixelService],
    }).compile();

    service = module.get<HypixelService>(HypixelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
