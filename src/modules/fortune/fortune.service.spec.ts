import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { FortuneService } from './fortune.service';

describe('오늘의 운세 서비스', () => {
  let fortuneService: FortuneService;
  beforeEach(async () => {
    const tstModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ envFilePath: './.env' }), HttpModule],
      providers: [FortuneService],
    }).compile();
    fortuneService = tstModule.get<FortuneService>(FortuneService);
  });
  it('오늘의 운세 서비스가 존재한다.', () => {
    expect(fortuneService).toBeDefined();
  });

  it('OpenAi로부터 오늘의 운세를 잘 가져왔는지 확인한다.', async () => {
    const fortune = await fortuneService.getFortuneFromOpenAi();
    expect(fortune).toBeDefined();
    expect(typeof fortune).toBe('string');
  });
});
