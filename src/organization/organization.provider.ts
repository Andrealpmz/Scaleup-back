import { Mongoose } from 'mongoose';
import { WebhookSchema } from './schemaMongo/webhook.schema';
import { RevenuesSchema } from './schemaMongo/revenues.schemas';

export const webhookProviders = [
  {
    provide: 'WEBHOOK_MODEL',
    useFactory: (mongoose: Mongoose) => mongoose.model('Webhook', WebhookSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];

export const revenuesProviders = [
  {
    provide: 'REVENUES_MODEL',
    useFactory: (mongoose: Mongoose) => mongoose.model('Revenues', RevenuesSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];