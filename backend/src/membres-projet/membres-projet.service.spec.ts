import { Test, TestingModule } from '@nestjs/testing';
import { MembresProjetService } from './membres-projet.service';

describe('MembresProjetService', () => {
  let service: MembresProjetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MembresProjetService],
    }).compile();

    service = module.get<MembresProjetService>(MembresProjetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
