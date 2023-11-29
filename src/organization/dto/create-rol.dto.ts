import { Field, InputType, ID } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateRolDTO {
    @Field(() => ID, { nullable: true })
    id?: number;

    @IsNotEmpty()
    @Field()
    name: string;

    @Field({ nullable: true })
    active?: boolean;
}