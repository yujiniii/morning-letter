import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FortuneService } from './fortune.service';

@Module({
  imports: [HttpModule],
  providers: [FortuneService],
  exports: [FortuneService],
})
export class FortuneModule {}
