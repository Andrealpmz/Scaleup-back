import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationResolver } from './organization.resolver';

import { PubSub } from 'graphql-subscriptions';
import { OrganizationsController } from './controller/organization.controller';
import { revenuesProviders, webhookProviders } from './organization.provider';
import { MongoModule } from 'src/mongo/mongo.module';
import { OrganizationGateway } from './gateway/organization.gateway';

@Module({
  imports: [
    MongoModule
  ],
  providers: [
    OrganizationService,
    OrganizationResolver,
    OrganizationGateway,
    {
      provide: 'PUB_SUB',
      useClass: PubSub
    },
    ...webhookProviders,
    ...revenuesProviders
  ],
  controllers: [OrganizationsController]
})
export class OrganizationModule {}