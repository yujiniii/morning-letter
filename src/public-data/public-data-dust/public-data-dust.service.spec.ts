import { PublicDataDustService } from './public-data-dust.service';
import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { PublicDataHelperModule } from '../public-data-helper/public-data-helper.module';

describe('미세먼지 조회 서비스', () => {
  let dustService: PublicDataDustService;
  beforeEach(async () => {
    const tstModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ envFilePath: './.env' }),
        PublicDataHelperModule,
      ],
      providers: [PublicDataDustService],
    }).compile();
    dustService = tstModule.get<PublicDataDustService>(PublicDataDustService);
  });
  it('미세먼지 조회 서비스가 정의되어 있다.', () => {
    expect(dustService).toBeDefined();
  });
  it('미세먼지 조회 서비스가 필요한 데이터를 반환한다.', async () => {
    const data = await dustService.getPublicDataDust('seoul');
    expect(data).toHaveProperty('pm10');
    expect(data).toHaveProperty('pm25');
    expect(data).toHaveProperty('stationName');
  });
});
