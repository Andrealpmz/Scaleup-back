import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class AreaModel {
    @Field(() => Int)
    id: number;

    @Field()
    name: string;

    @Field()
    image?: string;

    @Field()
    color?: string;

    @Field()
    description?: string;
}