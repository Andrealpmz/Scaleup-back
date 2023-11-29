import { Field, InputType, Int ,  PartialType} from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsNumber, IsString} from 'class-validator';

@InputType()
export class LoginOrganizationDTO {
    @IsNotEmpty()
    @IsEmail()
    @Field()
    email: string;

    @IsNotEmpty()
    @IsString()
    @Field({nullable: true})
    password: string;
}