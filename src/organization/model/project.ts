import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@ObjectType()
export class Project {
    @Field(() => ID)
    id: number;

    @Field()
    name: string;

    @Field()
    type: string;

    @Field({ nullable: true })
    celebration_day: Date;

    @Field({ nullable: true })
    deadline: Date;

    @Field()
    description: string;

    @Field({ nullable: true }) // Campo opcional
    obj_general?: string | null;

    @Field(() => [String!], { nullable: true }) // Campo opcional
    obj_specifics?: string[] | null;

    @Field(() => Int, { nullable: true }) // Campo opcional
    budget?: number | null;

    @Field({ nullable: true }) // Campo opcional
    software?: string | null;

    @Field({ nullable: true }) // Campo opcional
    state?: string | null;

    @IsOptional()
    @Field({ nullable: true }) // Campo opcional
    leader_id?: number | null;

    @Field({ nullable: true }) // Campo opcional
    image?: string | null;

    @Field(() => Int!)
    org_id: number;
}
