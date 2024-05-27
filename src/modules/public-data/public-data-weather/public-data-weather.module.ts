import { Module } from '@nestjs/common';
import { PublicDataWeatherService } from './public-data-weather.service';
import { PublicDataHelperModule } from '../public-data-helper/public-data-helper.module';

@Module({
  imports: [PublicDataHelperModule],
  providers: [PublicDataWeatherService],
  exports: [PublicDataWeatherService],
})
export class PublicDataWeatherModule {}
