import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class Resources {
    @Field(() => Int)
    id: number;

    @Field()
    file: string;

    @Field()
    name: string;
    
    @Field(() => Int)
    project_id: number;

    @Field(() => Int)
    activity_id: number

    @Field()
    created_at: Date;
}