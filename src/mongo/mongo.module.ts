import { Module } from '@nestjs/common';
import { databaseProviders } from './mongo.provider';

@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class MongoModule {}