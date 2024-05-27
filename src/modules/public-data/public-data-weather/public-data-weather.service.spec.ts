import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { PublicDataWeatherService } from './public-data-weather.service';
import { PublicDataHelperModule } from '../public-data-helper/public-data-helper.module';

describe('날씨 조회 서비스', () => {
  let weatherService: PublicDataWeatherService;
  beforeEach(async () => {
    const tstModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ envFilePath: './.env' }),
        PublicDataHelperModule,
      ],
      providers: [PublicDataWeatherService],
    }).compile();
    weatherService = tstModule.get<PublicDataWeatherService>(
      PublicDataWeatherService,
    );
  });
  it('날씨 조회 서비스가 정의되어 있다.', () => {
    expect(weatherService).toBeDefined();
  });
  it('날씨 조회 서비스가 필요한 데이터를 반환한다.', async () => {
    const data = await weatherService.getWeather('seoul');
    expect(data?.[0]).toHaveProperty('category');
    expect(data?.[0]).toHaveProperty('dateTime');
    expect(data?.[0]).toHaveProperty('value');
  });
});
