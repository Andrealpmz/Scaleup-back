import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class AssignAreaDTO {
    @Field(() => Int, { nullable: true })
    id?: number;

    @Field({ nullable: true })
    type?: string;

    @IsNotEmpty()
    @IsString()
    @Field({ nullable: true })
    name: string;

    @Field({ nullable: true })
    image?: string;

    @Field({ nullable: true })
    color?: string;

    @Field({ nullable: true })
    description?: string;
}