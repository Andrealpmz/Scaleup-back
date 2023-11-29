import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class Role {
    @Field(() => Int)
    id: number;

    @Field()
    name: string;

    @Field()
    active?: boolean;
}