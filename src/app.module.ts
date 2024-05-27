import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PublicDataModule } from './modules/public-data/public-data.module';
import { NewsModule } from './modules/news/news.module';
import { FortuneModule } from './modules/fortune/fortune.module';
import { EmailService } from './mail.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PublicDataModule,
    NewsModule,
    FortuneModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
