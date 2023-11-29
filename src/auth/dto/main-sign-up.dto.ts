import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength, ValidateNested} from 'class-validator';

@InputType()
class UserObj{
    @IsNotEmpty()
    @IsEmail()
    @Field({nullable: true})
    email: string;
  
    @IsString()
    @IsNotEmpty()
    @Field({nullable: true})
    name: string
  
    @IsString()
    @IsNotEmpty()
    @Field({nullable: true})
    phone: string
  
    @IsString()
    @IsNotEmpty()
    @Field({nullable: true})
    last_name: string
  
    @IsString()
    @IsNotEmpty()
    @Field({nullable: true})
    country: string

    @IsString()
    @IsNotEmpty()
    @Field({nullable: true})
    city: string
  
    @IsString()
    @IsNotEmpty()
    @Field({nullable: true})
    password: string
}

@InputType()
class OrgObj {
    @IsNotEmpty()
    @IsString()
    @Field()
    name: string;

    @IsNotEmpty()
    @IsString()
    @Field()
    type: string;

    @IsNotEmpty()
    @IsString()
    @Field()
    nit: string;

    @IsNotEmpty()
    @IsString()
    @Field()
    city: string;

    @IsNotEmpty()
    @IsString()
    @Field()
    country: string;
}

@InputType()
class TestObj {
    @IsNotEmpty()
    @IsNumber()
    @Field()
    question_id: number;

    @IsNotEmpty()
    @IsNumber()
    @Field()
    answer_id: number;  
}

@InputType()
export class MainSignUpDTO {
    @ValidateNested()
    @Field(() => UserObj)
    user: UserObj;

    @ValidateNested()
    @Field(() => OrgObj)
    organization: OrgObj;

    @ValidateNested()
    @IsOptional()
    @IsArray()
    @Field(() => [TestObj])
    test: TestObj[];

}