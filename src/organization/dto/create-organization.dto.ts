import { Field, InputType, Int, ID } from '@nestjs/graphql';
import { IsArray, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateOrganizationDTO {

  @IsNotEmpty()
  @IsString()
  @Field({nullable: true})
  nit: string;

  @IsNotEmpty()
  @IsString()
  @Field({nullable: true})
  name: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  type: string;

  @IsString()
  @IsOptional()
  @Field({nullable: true})
  logo?: string;
  
  @IsNotEmpty()
  @IsString()
  @Field({nullable: true})
  country: string;

  @IsNotEmpty()
  @IsString()
  @Field({nullable: true})
  city: string;

  @IsString()
  @IsOptional()
  @Field({nullable: true})
  website?: string;

}



