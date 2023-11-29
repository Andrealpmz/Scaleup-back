import { Field, InputType, ID, Int } from '@nestjs/graphql';
import { IsArray, IsBoolean, IsDate, IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

@InputType()
export class CreateResourceDTO {
    @Field(() => ID, { nullable: true })
    id: number;

    @IsNotEmpty()
    @IsString()
    @Field({ nullable: true })
    name: string;

    @IsNotEmpty()
    @Field()
    file: string;
    
    @IsNotEmpty()
    @Field(() => Int)
    project_id: number;

    @IsNotEmpty()
    @Field(() => Int)
    activity_id: number;

    @Field({ nullable: true })
    upload_at?: Date;

    @Field({ nullable: true })
    created_at: Date;
}