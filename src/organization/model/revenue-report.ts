import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
class Report {
    @Field(() => Date, {nullable: true})
    date: Date;

    @Field(() => Int, {nullable: true})
    amount: number; 
}

@ObjectType()
export class RevenueReport {
  @Field(() => Int, {nullable: true})
  org_id: number;

  @Field(() => String, {nullable: true})
  project_id: number

  @Field(() => String, {nullable: true})
  budget: number

  @Field(() => [Report], {nullable: true})
  revenue_reports: Report[] ;

  @Field(() => [Report], {nullable: true})
  budget_reports: Report[] ;

}


