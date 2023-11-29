import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class Answers {
    @Field(() => Int, {nullable: true})
    id: number;

    @Field({nullable: true})
    value: number;

    @Field({nullable: true})
    content: string;

    @Field({nullable: true})
    type: string;
}