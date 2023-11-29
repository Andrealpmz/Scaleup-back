import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class Members {
  @Field(() => Int)
  user_id: number;

  @Field(() => Int)
  project_id: number;
}