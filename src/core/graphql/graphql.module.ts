import { Module } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';

@Module({
    imports: [
        GraphQLModule.forRoot<ApolloDriverConfig>({
            introspection: true,
            driver: ApolloDriver,
            autoSchemaFile: join(process.cwd(), 'src/core/graphql/api.schema.gql'),
            installSubscriptionHandlers: true,
            // subscriptions: {
            //     'graphql-ws': true
            // },
        }),
    ],
})
export class GraphqlModule {}
