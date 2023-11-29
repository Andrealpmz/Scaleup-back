import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core/core.module';
import { PrismaService } from './core/prisma/prisma.service';
import { PrismaModule } from './core/prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { OrganizationModule } from './organization/organization.module';
import { PubSub } from 'graphql-subscriptions';

@Module({
  imports: [
    PrismaModule,
    OrganizationModule,
    CoreModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    {
      provide: 'PUB_SUB',
      useClass: PubSub
    },
  ],
})
export class AppModule {}
