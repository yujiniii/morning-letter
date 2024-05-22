import { Module } from '@nestjs/common';
import { PublicDataWeatherModule } from './public-data-weather/public-data-weather.module';
import { PublicDataDustModule } from './public-data-dust/public-data-dust.module';

@Module({
  imports: [PublicDataDustModule, PublicDataWeatherModule],
})
export class PublicDataModule {}
