import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MaxLength, MinLength} from 'class-validator';

@InputType()
export class LoginAuthDTO {
  @IsNotEmpty()
  @IsEmail()
  @Field({nullable: true})
  email: string;

  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  @Field({nullable: true})
  password: string;
}