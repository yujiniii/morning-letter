import { Module } from '@nestjs/common';
import { PublicDataDustService } from './public-data-dust.service';
import { PublicDataHelperModule } from '../public-data-helper/public-data-helper.module';

@Module({
  imports: [PublicDataHelperModule],
  providers: [PublicDataDustService],
  exports: [PublicDataDustService],
})
export class PublicDataDustModule {}
