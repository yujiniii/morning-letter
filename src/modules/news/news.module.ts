import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { NewsService } from './news.service';

@Module({
  imports: [HttpModule],
  providers: [NewsService],
  exports: [NewsService],
})
export class NewsModule {}
