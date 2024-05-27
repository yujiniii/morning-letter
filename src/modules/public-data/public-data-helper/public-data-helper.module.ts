import { Module } from '@nestjs/common';
import { PublicDataHelperService } from './public-data-helper.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [PublicDataHelperService],
  exports: [PublicDataHelperService],
})
export class PublicDataHelperModule {}
