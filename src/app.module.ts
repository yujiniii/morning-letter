import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PublicDataModule } from './public-data/public-data.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PublicDataModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
