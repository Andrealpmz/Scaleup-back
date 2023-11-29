import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Answers } from './answers.model';

@ObjectType()
export class QuestionAnswers {
    @Field(() => Int, {nullable: true})
    id: number;

    @Field(() => Int, {nullable: true})
    question: number;

    @Field(() => Int, {nullable: true})
    answer: number;

    @Field(() => Answers, {nullable: true})
    answer_relation: Answers;
}