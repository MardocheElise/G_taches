import { Test, TestingModule } from '@nestjs/testing';
import { MembresProjetController } from './membres-projet.controller';

describe('MembresProjetController', () => {
  let controller: MembresProjetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MembresProjetController],
    }).compile();

    controller = module.get<MembresProjetController>(MembresProjetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
