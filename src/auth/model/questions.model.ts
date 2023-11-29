import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { QuestionAnswers } from './questions_answers.model';

@ObjectType()
export class Questions {
    @Field(() => Int, {nullable: true})
    id: number;

    @Field({nullable: true})
    content: string;

    @Field({nullable: true})
    description: string;

    @Field({nullable: true})
    area_id: number;

    @Field({nullable: true})
    type: string;

    @Field({nullable: true})
    image: string;

    @Field({nullable: true})
    is_main: boolean;

    @Field(() => [QuestionAnswers], {nullable: true})
    question_answers: QuestionAnswers[]

}