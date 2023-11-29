import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Questions } from './questions.model';

@ObjectType()
export class Area {
    @Field(() => Int, {nullable: true})
    id: number;

    @Field({nullable: true})
    name: string;

    @Field(() => [Questions], {nullable: true})
    question: Questions[];
}