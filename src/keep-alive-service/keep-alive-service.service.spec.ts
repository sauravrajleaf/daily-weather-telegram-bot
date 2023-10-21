import { Test, TestingModule } from '@nestjs/testing';
import { KeepAliveServiceService } from './keep-alive-service.service';

describe('KeepAliveServiceService', () => {
  let service: KeepAliveServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KeepAliveServiceService],
    }).compile();

    service = module.get<KeepAliveServiceService>(KeepAliveServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
