import { Field, InputType, Int } from '@nestjs/graphql';
import { IsArray, IsDate, IsNotEmpty, IsString, IsDateString } from 'class-validator';

@InputType()
export class CreateProjectDTO {
  @IsNotEmpty()
  @IsString()
  @Field({ nullable: true })
  name: string;

  @IsNotEmpty()
  @IsString()
  @Field({nullable: true})
  key: string;

  @IsNotEmpty()
  @IsString()
  @Field({ nullable: true })
  type: string;

  @Field(() => Date)
  celebration_day: Date;

  @Field(() => Date)
  deadline: Date;

  @IsNotEmpty()
  @IsString()
  @Field({ nullable: true })
  description: string;

  @Field({ nullable: true })
  obj_general?: string;

  @Field(() => [String!]!, { nullable: true })
  obj_specifics?: string[];

  @Field(() => Int, { nullable: true })
  budget?: number;

  @Field({nullable: true})
  software?: string;

  @Field({ nullable: true })
  state?: string;

  @Field({ nullable: true })
  leader_id?: number;

  @Field({ nullable: true })
  image?: string;
  
  @Field(() => Int, { nullable: true })
  org_id: number;

  @IsNotEmpty()
  @Field({nullable: true})
  token: string;

  @IsNotEmpty()
  @Field({nullable: true})
  cloud_id: string;

  @IsNotEmpty()
  @Field({nullable: true})
  lead_account_id: string;

  @IsNotEmpty()
  @Field({nullable: true})
  project_type_key: string;

  @IsNotEmpty()
  @Field({nullable: true})
  project_template_key: string;

}

